<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateManualUploadMagicLinks extends Command
{
    protected $signature = 'links:manual-upload 
                            {emails?* : Space-separated list of emails (or pass via stdin)}
                            {--base-url=https://onestoryplanet.com : Base URL}';

    protected $description = 'Generate magic links that log in the user and redirect to manual-upload-video';

    private const ENCRYPTION_KEY = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
    ];

    public function handle(): int
    {
        $emails = $this->argument('emails');
        if (empty($emails)) {
            $this->error('Please provide at least one email, e.g. php artisan links:manual-upload user@example.com');
            return Command::FAILURE;
        }

        $baseUrl = rtrim($this->option('base-url'), '/');
        $key = pack('C*', ...self::ENCRYPTION_KEY);
        $links = [];

        foreach ($emails as $email) {
            $email = trim($email);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->warn("Skipping invalid email: {$email}");
                continue;
            }
            $iv = random_bytes(16);
            $encrypted = openssl_encrypt($email, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
            $token = urlencode(base64_encode($encrypted));
            $ivEnc = urlencode(base64_encode($iv));
            $link = "{$baseUrl}/manual-upload-video-login?token={$token}&iv={$ivEnc}";
            $links[] = ['email' => $email, 'link' => $link];
        }

        $this->newLine();
        foreach ($links as $row) {
            $this->line($row['email']);
            $this->line($row['link']);
            $this->newLine();
        }
        $this->info('Total: ' . count($links) . ' link(s).');

        return Command::SUCCESS;
    }
}
