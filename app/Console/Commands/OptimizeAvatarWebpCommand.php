<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeAvatarWebpCommand extends Command
{
    protected $signature = 'avatars:optimize-webp {--limit=0 : Max files to process (0 = all)} {--quality=76 : WEBP quality (0-100)}';

    protected $description = 'Center-crop and resize existing avatar WEBP files to reduce payload';

    public function handle(): int
    {
        $disk = Storage::disk('public');
        $allFiles = $disk->files('users-avatar');
        $webpFiles = array_values(array_filter($allFiles, function (string $path): bool {
            return strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'webp';
        }));

        if (empty($webpFiles)) {
            $this->warn('No WEBP avatar files found in public/users-avatar.');
            return self::SUCCESS;
        }

        $limit = max(0, (int) $this->option('limit'));
        $quality = min(100, max(0, (int) $this->option('quality')));
        $files = $limit > 0 ? array_slice($webpFiles, 0, $limit) : $webpFiles;

        $processed = 0;
        $skipped = 0;
        $failed = 0;
        $totalBefore = 0;
        $totalAfter = 0;

        $this->info('Optimizing ' . count($files) . ' avatar WEBP files...');

        foreach ($files as $path) {
            try {
                if (!$disk->exists($path)) {
                    $skipped++;
                    continue;
                }

                $binary = $disk->get($path);
                $beforeSize = strlen($binary);
                $image = @imagecreatefromstring($binary);
                if (!$image) {
                    $failed++;
                    continue;
                }

                if (function_exists('imagepalettetotruecolor') && !imageistruecolor($image)) {
                    @imagepalettetotruecolor($image);
                }
                imagealphablending($image, true);
                imagesavealpha($image, true);

                $optimized = $this->resizeAndCropSquare($image, 160);
                imagedestroy($image);

                if (!$optimized) {
                    $failed++;
                    continue;
                }

                ob_start();
                $ok = imagewebp($optimized, null, $quality);
                $result = ob_get_clean();
                imagedestroy($optimized);

                if (!$ok || $result === false) {
                    $failed++;
                    continue;
                }

                $afterSize = strlen($result);
                $disk->put($path, $result);

                $totalBefore += $beforeSize;
                $totalAfter += $afterSize;
                $processed++;
            } catch (\Throwable $e) {
                $failed++;
            }
        }

        $savedBytes = max(0, $totalBefore - $totalAfter);
        $savedPercent = $totalBefore > 0 ? round(($savedBytes / $totalBefore) * 100, 2) : 0;

        $this->newLine();
        $this->info("Processed: {$processed}");
        $this->line("Skipped: {$skipped}");
        $this->line("Failed: {$failed}");
        $this->line("Before: {$this->formatBytes($totalBefore)}");
        $this->line("After: {$this->formatBytes($totalAfter)}");
        $this->info("Saved: {$this->formatBytes($savedBytes)} ({$savedPercent}%)");

        return self::SUCCESS;
    }

    private function resizeAndCropSquare($sourceImage, int $targetSize)
    {
        $sourceWidth = imagesx($sourceImage);
        $sourceHeight = imagesy($sourceImage);
        if ($sourceWidth <= 0 || $sourceHeight <= 0 || $targetSize <= 0) {
            return null;
        }

        $cropSize = min($sourceWidth, $sourceHeight);
        $cropX = (int) floor(($sourceWidth - $cropSize) / 2);
        $cropY = (int) floor(($sourceHeight - $cropSize) / 2);

        $targetImage = imagecreatetruecolor($targetSize, $targetSize);
        if (!$targetImage) {
            return null;
        }

        imagealphablending($targetImage, false);
        imagesavealpha($targetImage, true);
        $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
        imagefilledrectangle($targetImage, 0, 0, $targetSize, $targetSize, $transparent);

        $copied = imagecopyresampled(
            $targetImage,
            $sourceImage,
            0,
            0,
            $cropX,
            $cropY,
            $targetSize,
            $targetSize,
            $cropSize,
            $cropSize
        );

        if (!$copied) {
            imagedestroy($targetImage);
            return null;
        }

        return $targetImage;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $power = (int) floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);
        $value = $bytes / (1024 ** $power);

        return number_format($value, 2) . ' ' . $units[$power];
    }
}

