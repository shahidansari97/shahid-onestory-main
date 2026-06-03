<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class VisitorController extends Controller
{
    private const TEL_AVIV_TIMEZONE = 'Asia/Jerusalem';

    private function getDurationColumn(): ?string
    {
        if (Schema::hasColumn('visits', 'duration_seconds')) {
            return 'duration_seconds';
        }

        if (Schema::hasColumn('visits', 'duration_second')) {
            return 'duration_second';
        }

        return null;
    }

    private function parseDateRangeToUtc(?string $date, bool $endOfDay = false): ?Carbon
    {
        if (!$date) {
            return null;
        }

        $parsedDate = Carbon::parse($date, self::TEL_AVIV_TIMEZONE);
        $boundedDate = $endOfDay ? $parsedDate->endOfDay() : $parsedDate->startOfDay();

        return $boundedDate->utc();
    }

    private function getTodayRangeUtc(): array
    {
        $nowInTelAviv = now(self::TEL_AVIV_TIMEZONE);

        return [
            $nowInTelAviv->copy()->startOfDay()->utc(),
            $nowInTelAviv->copy()->endOfDay()->utc(),
        ];
    }

    private function toTelAvivIso(mixed $value): ?string
    {
        if (!$value) {
            return null;
        }

        return Carbon::parse($value)->setTimezone(self::TEL_AVIV_TIMEZONE)->toIso8601String();
    }

    private function appendTodayDurationSum(Builder $query, ?string $durationColumn, Carbon $todayStartUtc, Carbon $todayEndUtc): Builder
    {
        if (!$durationColumn) {
            return $query;
        }

        return $query->withSum(
            [
                'visits as today_duration_total_seconds' => function ($visitQuery) use ($todayStartUtc, $todayEndUtc) {
                    $visitQuery->whereBetween('visited_at', [$todayStartUtc, $todayEndUtc]);
                },
            ],
            $durationColumn
        );
    }

    private function transformVisitorForResponse(Visitor $visitor): Visitor
    {
        $visitor->created_at = $this->toTelAvivIso($visitor->created_at);
        $visitor->updated_at = $this->toTelAvivIso($visitor->updated_at);

        if ($visitor->visits_max_visited_at) {
            $visitor->visits_max_visited_at = $this->toTelAvivIso($visitor->visits_max_visited_at);
        }

        $visitor->duration_total_seconds = (int) ($visitor->today_duration_total_seconds ?? 0);

        return $visitor;
    }

    private function applyTodayVisitorsFilter(Builder $query, Carbon $todayStartUtc, Carbon $todayEndUtc): Builder
    {
        // "View: Today" should mean visitors who had at least one visit today.
        return $this->applyTodayVisitsFilter($query, $todayStartUtc, $todayEndUtc);
    }

    private function applyTodayVisitsFilter(Builder $query, Carbon $todayStartUtc, Carbon $todayEndUtc): Builder
    {
        return $query->whereHas('visits', function ($visitQuery) use ($todayStartUtc, $todayEndUtc) {
            $visitQuery->whereBetween('visited_at', [$todayStartUtc, $todayEndUtc]);
        });
    }

    private function applyTimeSpentFilter(Builder $query, string $durationColumn, bool $isTodayFilter, Carbon $todayStartUtc, Carbon $todayEndUtc): Builder
    {
        return $query->whereHas('visits', function ($visitQuery) use ($durationColumn, $isTodayFilter, $todayStartUtc, $todayEndUtc) {
            $visitQuery->where($durationColumn, '>', 0);

            if ($isTodayFilter) {
                $visitQuery->whereBetween('visited_at', [$todayStartUtc, $todayEndUtc]);
            }
        });
    }

    private function getAverageDailyDurationMap(array $visitorIds, ?string $durationColumn): array
    {
        if (!$durationColumn || empty($visitorIds)) {
            return [];
        }

        return Visit::query()
            ->select('visitor_id')
            ->selectRaw("SUM({$durationColumn}) as total_duration_seconds")
            ->selectRaw('COUNT(DISTINCT DATE(visited_at)) as active_days_count')
            ->whereIn('visitor_id', $visitorIds)
            ->groupBy('visitor_id')
            ->get()
            ->mapWithKeys(function ($row) {
                $activeDays = max((int) ($row->active_days_count ?? 0), 1);
                $totalDuration = (int) ($row->total_duration_seconds ?? 0);

                return [(int) $row->visitor_id => (int) floor($totalDuration / $activeDays)];
            })
            ->toArray();
    }

    public function index(Request $request)
    {
        $durationColumn = $this->getDurationColumn();
        $search = $request->get('search');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $filter = $request->get('filter', 'all');
        $viewFilter = $request->get('view_filter', 'today');
        $timeSpentFilter = $request->get('time_spent_filter', 'gt_0');
        if ($filter === 'today') {
            $filter = 'all';
            $viewFilter = 'today';
        }
        $start = $this->parseDateRangeToUtc($startDate);
        $end = $this->parseDateRangeToUtc($endDate, true);
        [$todayStartUtc, $todayEndUtc] = $this->getTodayRangeUtc();
        $isTodayFilter = $viewFilter === 'today';

        $scopedVisitorsQuery = Visitor::query();
        if ($isTodayFilter) {
            $this->applyTodayVisitorsFilter($scopedVisitorsQuery, $todayStartUtc, $todayEndUtc);
        }
        if ($timeSpentFilter === 'gt_0' && $durationColumn) {
            $this->applyTimeSpentFilter($scopedVisitorsQuery, $durationColumn, $isTodayFilter, $todayStartUtc, $todayEndUtc);
        }

        // Get statistics from the date-scoped base query.
        $totalVisitorsQuery = clone $scopedVisitorsQuery;
        $guestVisitorsQuery = (clone $scopedVisitorsQuery)->whereNull('user_id');
        $returnVisitorsQuery = (clone $scopedVisitorsQuery)->whereNotNull('user_id');

        $totalVisitors = $totalVisitorsQuery->count();
        $guestVisitors = $guestVisitorsQuery->count();
        $returnVisitors = $returnVisitorsQuery->count();

        $visitors = (clone $scopedVisitorsQuery)
            ->with(['user:id,username,email'])
            ->withCount('visits')
            ->tap(fn ($query) => $this->appendTodayDurationSum($query, $durationColumn, $todayStartUtc, $todayEndUtc))
            ->withMax('visits', 'visited_at')
            ->when($filter === 'guest', function ($query) {
                $query->whereNull('user_id');
            })
            ->when($filter === 'returning', function ($query) {
                $query->whereNotNull('user_id');
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('visitor_token', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('username', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($start || $end, function ($query) use ($start, $end) {
                $query->whereHas('visits', function ($visitQuery) use ($start, $end) {
                    if ($start && $end) {
                        $visitQuery->whereBetween('visited_at', [$start, $end]);
                    } elseif ($start) {
                        $visitQuery->where('visited_at', '>=', $start);
                    } else {
                        $visitQuery->where('visited_at', '<=', $end);
                    }
                });
            })

            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        // Today's visitors (for the Today Visitors card)
        $todayVisitorsQuery = Visitor::query()
            ->with(['user:id,username,email'])
            ->withCount('visits')
            ->tap(fn ($query) => $this->appendTodayDurationSum($query, $durationColumn, $todayStartUtc, $todayEndUtc))
            ->withMax('visits', 'visited_at')
            ->tap(fn ($query) => $this->applyTodayVisitsFilter($query, $todayStartUtc, $todayEndUtc));

        // Keep Today Visitors card consistent with the table's default "time spent > 0" meaning.
        if ($timeSpentFilter === 'gt_0' && $durationColumn) {
            $this->applyTimeSpentFilter($todayVisitorsQuery, $durationColumn, true, $todayStartUtc, $todayEndUtc);
        }
        $todayVisitorsList = $todayVisitorsQuery
            ->orderByDesc('id')
            ->get()
            ->map(fn ($visitor) => $this->transformVisitorForResponse($visitor));
        $todayVisitorsCount = $todayVisitorsList->count();

             //dd($visitors);
        $visitorAverageDailyDurationMap = $this->getAverageDailyDurationMap(
            $visitors->getCollection()->pluck('id')->map(fn ($id) => (int) $id)->all(),
            $durationColumn
        );

        $visitorItems = $visitors->getCollection()->map(function ($visitor) use ($visitorAverageDailyDurationMap) {
            $visitor = $this->transformVisitorForResponse($visitor);
            $visitor->average_daily_duration_seconds = (int) ($visitorAverageDailyDurationMap[(int) $visitor->id] ?? 0);

            return $visitor;
        });

        return Inertia::render('Dashboard/Visitors/Index', [
            'visitors' => $visitorItems,
            'currentPage' => $visitors->currentPage(),
            'lastPage' => $visitors->lastPage(),
            'perPage' => $visitors->perPage(),
            'totalVisitors' => $totalVisitors,
            'guestVisitors' => $guestVisitors,
            'returnVisitors' => $returnVisitors,
            'todayVisitors' => $todayVisitorsCount,
            'todayVisitorsList' => $todayVisitorsList,
            'search' => $search,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'filter' => $filter,
            'viewFilter' => $viewFilter,
            'timeSpentFilter' => $timeSpentFilter,
        ]);
    }

    public function show(Visitor $visitor, Request $request)
    {
        $durationColumn = $this->getDurationColumn();
        $hasEndedAt = Schema::hasColumn('visits', 'ended_at');
        $visitor->load(['user:id,username,email']);
        $visitor = $this->transformVisitorForResponse($visitor);

        $selectColumns = ['id', 'visitor_id', 'user_id', 'ip_address', 'url', 'visited_at', 'created_at', 'updated_at'];
        if ($durationColumn) {
            $selectColumns[] = $durationColumn;
        }
        if ($hasEndedAt) {
            $selectColumns[] = 'ended_at';
        }

        $visits = $visitor->visits()
            ->select($selectColumns)
            ->orderByDesc('visited_at')
            ->paginate(10)
            ->withQueryString();

        $visitItems = $visits->getCollection()->map(function ($visit) use ($durationColumn) {
            if ($visit->visited_at) {
                $visit->visited_at = $this->toTelAvivIso($visit->visited_at);
            }
            if ($visit->ended_at) {
                $visit->ended_at = $this->toTelAvivIso($visit->ended_at);
            }
            $visit->created_at = $this->toTelAvivIso($visit->created_at);
            $visit->updated_at = $this->toTelAvivIso($visit->updated_at);
            $visit->duration_seconds = (int) ($durationColumn ? ($visit->{$durationColumn} ?? 0) : 0);

            return $visit;
        });

        return Inertia::render('Dashboard/Visitors/Show', [
            'visitor' => $visitor,
            'visits' => $visitItems,
            'currentPage' => $visits->currentPage(),
            'lastPage' => $visits->lastPage(),
            'perPage' => $visits->perPage(),
            'totalVisits' => $visits->total(),
        ]);
    }

    public function logs(Visitor $visitor, Request $request)
    {
        $durationColumn = $this->getDurationColumn();
        $visitor->load(['user:id,username,email']);
        $visitor = $this->transformVisitorForResponse($visitor);
        [$todayStartUtc, $todayEndUtc] = $this->getTodayRangeUtc();

        $logs = Visitor::with(['user:id,username,email'])
            ->withCount('visits')
            ->tap(fn ($query) => $this->appendTodayDurationSum($query, $durationColumn, $todayStartUtc, $todayEndUtc))
            ->withMax('visits', 'visited_at')
            ->when($visitor->ip_address, function ($query) use ($visitor) {
                $query->where('ip_address', $visitor->ip_address);
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $logItems = $logs->getCollection()->map(fn ($visitor) => $this->transformVisitorForResponse($visitor));

        return Inertia::render('Dashboard/Visitors/Logs', [
            'visitor' => $visitor,
            'logs' => $logItems,
            'currentPage' => $logs->currentPage(),
            'lastPage' => $logs->lastPage(),
            'perPage' => $logs->perPage(),
            'totalSameIPVisitors' => $logs->total(),
        ]);
    }

    public function storeDuration(Request $request): JsonResponse
    {
        $durationColumn = $this->getDurationColumn();
        if (!$durationColumn) {
            return response()->json(['ok' => false, 'message' => 'Duration column not available']);
        }

        $validated = $request->validate([
            'url' => ['required', 'string', 'max:2048'],
            'duration_seconds' => ['required', 'integer', 'min:0', 'max:86400'],
            'started_at' => ['nullable', 'date'],
        ]);

        $rawPath = parse_url($validated['url'], PHP_URL_PATH) ?: '';
        $requestPath = ltrim($rawPath, '/');
        if (str_starts_with($requestPath, 'api/') || str_starts_with($requestPath, 'media/get')) {
            return response()->json(['ok' => true, 'skipped' => true]);
        }

        $token = $request->cookie('visitor_token');
        if (!$token) {
            return response()->json(['ok' => false, 'message' => 'Missing visitor token']);
        }

        $visitor = Visitor::where('visitor_token', $token)->first();
        if (!$visitor) {
            return response()->json(['ok' => false, 'message' => 'Visitor not found']);
        }

        $safeUrl = mb_substr((string) $validated['url'], 0, 2048);
        $startedAt = !empty($validated['started_at']) ? Carbon::parse($validated['started_at']) : now();
        $now = now();

        $visitQuery = Visit::query()
            ->where('visitor_id', $visitor->id)
            ->where('url', $safeUrl)
            ->whereBetween('visited_at', [
                $startedAt->copy()->subMinutes(10),
                $startedAt->copy()->addMinutes(10),
            ]);

        $visit = $visitQuery->latest('visited_at')->first();

        if (!$visit) {
            $payload = [
                'visitor_id' => $visitor->id,
                'user_id' => auth()->id(),
                'ip_address' => $request->ip(),
                'url' => $safeUrl,
                'visited_at' => $startedAt,
                $durationColumn => (int) $validated['duration_seconds'],
            ];

            if (Schema::hasColumn('visits', 'ended_at')) {
                $payload['ended_at'] = $now;
            }

            Visit::create($payload);
            return response()->json(['ok' => true, 'created' => true]);
        }

        $currentDuration = (int) ($visit->{$durationColumn} ?? 0);
        $incomingDuration = (int) $validated['duration_seconds'];
        $visit->{$durationColumn} = max($currentDuration, $incomingDuration);

        if (Schema::hasColumn('visits', 'ended_at')) {
            $visit->ended_at = $now;
        }

        $visit->save();

        return response()->json(['ok' => true]);
    }

    public function delete(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:visitors,id',
            ]);

            $visitor = Visitor::findOrFail($validated['id']);

            // Delete all related visits first
            $visitor->visits()->delete();

            // Delete the visitor
            $visitor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Visitor and all related visits deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete visitor: ' . $e->getMessage(),
            ], 500);
        }
    }

}
