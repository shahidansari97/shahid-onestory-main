<?php

namespace App\Http\Middleware;

use App\Events\GiftTransactionCreated;
use App\Models\GiftTransactionLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogGiftTransactionDetails
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('post') && $request->routeIs('user.gift-transaction.store')) {
            $recentTransactions = GiftTransactionLog::where('ip_address', $request->ip())
                ->where('created_at', '>=', now()->subHour())
                ->count();

            if ($recentTransactions >= 5) {
                $message = "You have sent too many gifts for now. Try again later";

                return response()->json(["error" => $message]);
            }

            $log = GiftTransactionLog::create([
                'sender_id' => auth()->id(),
                'recipient_id' => $request->recipient_id,
                'gift_id' => $request->gift_id,
                'ip_address' => $request->ip(),
            ]);

            GiftTransactionCreated::dispatch($log);
        }

        return $next($request);
    }
}
