<?php

namespace App\Services;

class EditorUrlService
{
    private const ENCRYPTION_KEY = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ];

    public function generateStepOneUrl(int $userId, bool $isDraft = false): string
    {
        $baseUrl = rtrim((string) env('VITE_VIDEO_EDITOR_FRONTEND_BASE_URL', 'https://onestoryplanet.com/editor'), '/');

        $key = pack('C*', ...self::ENCRYPTION_KEY);
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt((string) $userId, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        $params = [
            'identification' => base64_encode($encrypted),
            'iv' => base64_encode($iv),
            'is_draft' => $isDraft ? 'true' : 'false',
        ];

        return $baseUrl . '/record/step-1/?' . http_build_query($params);
    }
}
