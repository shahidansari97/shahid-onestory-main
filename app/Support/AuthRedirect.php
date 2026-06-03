<?php

namespace App\Support;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AuthRedirect
{
    public const SESSION_KEY = 'auth_return_home';

    public const QUERY_PARAM = 'from_publish_message';

    public static function rememberReturnHome(Request $request): void
    {
        if ($request->query(self::QUERY_PARAM) === '1') {
            session([self::SESSION_KEY => true]);

            return;
        }

        // Only keep flag while moving login <-> register during an active publish flow.
        if (self::refererHasPublishMessageIntent($request->headers->get('referer', ''))) {
            return;
        }

        session()->forget(self::SESSION_KEY);
    }

    public static function applyIntentFromRequest(Request $request): void
    {
        if ($request->query(self::QUERY_PARAM) === '1' || $request->input(self::QUERY_PARAM) === '1') {
            session([self::SESSION_KEY => true]);
        }
    }

    public static function hasReturnHomeIntent(Request $request): bool
    {
        self::rememberReturnHome($request);

        return (bool) session(self::SESSION_KEY);
    }

    public static function syncPublishMessageQueryOnPage(Request $request, string $routeName, array $routeParams = []): ?RedirectResponse
    {
        if ($request->query(self::QUERY_PARAM) === '1') {
            return null;
        }

        if (!session(self::SESSION_KEY)) {
            return null;
        }

        // User returned from another page — drop stale publish flow and keep a clean URL.
        if (!self::refererHasPublishMessageIntent($request->headers->get('referer', ''))) {
            session()->forget(self::SESSION_KEY);

            return null;
        }

        $url = route($routeName, $routeParams);
        $separator = str_contains($url, '?') ? '&' : '?';

        return redirect()->to($url . $separator . self::QUERY_PARAM . '=1');
    }

    public static function consumeReturnHome(): bool
    {
        return (bool) session()->pull(self::SESSION_KEY);
    }

    public static function afterLoginRedirect(): RedirectResponse
    {
        if (self::consumeReturnHome()) {
            return redirect()->route('home');
        }

        return redirect()->intended(route('trigger.video.editor'));
    }

    /**
     * Post-auth redirect for Google/Facebook OAuth (matches email login vs publish-message flows).
     */
    public static function afterOAuthRedirect(bool $isNewUser = false): RedirectResponse
    {
        if (self::consumeReturnHome()) {
            return redirect()->route('home');
        }

        if ($isNewUser) {
            return redirect()->route('home', [
                'signup' => 'social',
                'open_editor' => '1',
            ]);
        }

        return redirect()->route('trigger.video.editor');
    }

    private static function refererHasPublishMessageIntent(string $referer): bool
    {
        if ($referer === '') {
            return false;
        }

        $query = parse_url($referer, PHP_URL_QUERY) ?? '';

        if ($query === '') {
            return false;
        }

        parse_str($query, $params);

        return ($params[self::QUERY_PARAM] ?? null) === '1';
    }
}
