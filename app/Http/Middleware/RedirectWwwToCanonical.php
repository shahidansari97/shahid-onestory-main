<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirect www to the apex host (e.g. www.onestoryplanet.com → onestoryplanet.com).
 * Requires a DNS record for www pointing at this server (Cloudflare CNAME).
 */
class RedirectWwwToCanonical
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower($request->getHost());

        if (str_starts_with($host, 'www.')) {
            $canonical = substr($host, 4);
            $target = $request->getScheme() . '://' . $canonical . $request->getRequestUri();

            return redirect()->away($target, 301);
        }

        return $next($request);
    }
}
