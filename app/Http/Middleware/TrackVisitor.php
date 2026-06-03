<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Visitor;
use App\Models\Visit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     $token = $request->cookie('visitor_token');
    //     if (!$token) {
    //         $token = Str::uuid()->toString();

    //         $visitor = Visitor::create([
    //             'visitor_token' => $token,
    //             'ip_address' => $request->ip(),
    //         ]);
           
    //         cookie()->queue('visitor_token', $token, 60 * 24 * 365);
    //     } else {
    //         $visitor = Visitor::where('visitor_token', $token)->first();
    //     }

    //     if ($visitor) {
    //         Visit::create([
    //             'visitor_id' => $visitor->id,
    //             'user_id' => auth()->id(),
    //             'ip_address' => $request->ip(),
    //             'visited_at' => now(),
    //         ]);
    //     }

    //     return $next($request);
    // }
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Track only GET requests.
        if (!$request->isMethod('get')) {
            return $response;
        }

        // Ignore static files (.css, .js, .png, etc.).
        if (str_contains($request->path(), '.')) {
            return $response;
        }

        // Ignore internal/API-style endpoints that should not be tracked as page visits.
        $excludedPrefixes = [
            'api/',
            'media/get',
        ];
        $requestPath = ltrim($request->path(), '/');
        foreach ($excludedPrefixes as $prefix) {
            if (str_starts_with($requestPath, $prefix)) {
                return $response;
            }
        }

        $token = $request->cookie('visitor_token');

        if (!$token) {
            $token = (string) Str::uuid();

            $visitor = Visitor::create([
                'visitor_token' => $token,
                'ip_address'    => $request->ip(),
            ]);

            // Attach cookie for 1 year.
            $response->headers->setCookie(
                cookie(
                    'visitor_token',
                    $token,
                    60 * 24 * 365,
                    '/',
                    null,
                    $request->isSecure(),
                    true,
                    false,
                    'Lax'
                )
            );
        } else {
            $visitor = Visitor::where('visitor_token', $token)->first();
        }

        if ($visitor) {
            // IMPORTANT:
            // - Don't store full querystring for OAuth callbacks (it contains secrets like `code` and `state`).
            // - Keep this short so it fits DB limits even before migrations run.
            $safeUrl = $request->url(); // no query string
            $safeUrl = mb_substr((string) $safeUrl, 0, 2048);
            $now = now();
            $durationColumn = Schema::hasColumn('visits', 'duration_seconds')
                ? 'duration_seconds'
                : (Schema::hasColumn('visits', 'duration_second') ? 'duration_second' : null);
            $hasEndedAt = Schema::hasColumn('visits', 'ended_at');

            try {
                $lastVisit = Visit::where('visitor_id', $visitor->id)
                    ->latest('visited_at')
                    ->first();

                if ($lastVisit && ($hasEndedAt ? !$lastVisit->ended_at : true) && $lastVisit->visited_at) {
                    $startedAt = Carbon::parse($lastVisit->visited_at);
                    $durationSeconds = max(0, $startedAt->diffInSeconds($now));

                    if ($durationColumn) {
                        $lastVisit->setAttribute($durationColumn, $durationSeconds);
                    }
                    if ($hasEndedAt) {
                        $lastVisit->ended_at = $now;
                    }
                    $lastVisit->save();
                }

                $payload = [
                    'visitor_id' => $visitor->id,
                    'user_id'    => auth()->id(),
                    'ip_address' => $request->ip(),
                    'url'        => $safeUrl,
                    'visited_at' => $now,
                ];
                if ($durationColumn) {
                    $payload[$durationColumn] = 0;
                }
                if ($hasEndedAt) {
                    $payload['ended_at'] = null;
                }

                Visit::create($payload);
            } catch (\Throwable $e) {
                // Tracking should never break the request.
            }
        }

        return $response;
    }

}
