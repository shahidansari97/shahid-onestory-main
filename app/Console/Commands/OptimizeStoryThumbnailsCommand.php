<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeStoryThumbnailsCommand extends Command
{
    protected $signature = 'stories:optimize-thumbnails {--limit=0 : Max files to process (0 = all)} {--quality=74 : WEBP quality (0-100)}';

    protected $description = 'Resize/compress story thumbnails in public storage for faster loads';

    public function handle(): int
    {
        if (!extension_loaded('gd') || !function_exists('imagecreatefromstring')) {
            $this->error('GD extension is required for thumbnail optimization.');
            return self::FAILURE;
        }

        $disk = Storage::disk('public');
        $files = $disk->files('stories/thumbnails');
        $candidates = array_values(array_filter($files, function (string $path): bool {
            $ext = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
            return in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true);
        }));

        if (empty($candidates)) {
            $this->warn('No thumbnails found in public/stories/thumbnails.');
            return self::SUCCESS;
        }

        $limit = max(0, (int) $this->option('limit'));
        $quality = min(100, max(0, (int) $this->option('quality')));
        $queue = $limit > 0 ? array_slice($candidates, 0, $limit) : $candidates;

        $processed = 0;
        $failed = 0;
        $skipped = 0;
        $totalBefore = 0;
        $totalAfter = 0;

        $this->info('Optimizing ' . count($queue) . ' story thumbnails...');

        foreach ($queue as $path) {
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

                $optimized = $this->resizeToFit($image, 640, 360);
                imagedestroy($image);
                if (!$optimized) {
                    $failed++;
                    continue;
                }

                $extension = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
                $optimizedBinary = $this->encodeByExtension($optimized, $extension, $quality);
                imagedestroy($optimized);

                if ($optimizedBinary === null) {
                    $failed++;
                    continue;
                }

                $afterSize = strlen($optimizedBinary);

                $disk->put($path, $optimizedBinary);

                $totalBefore += $beforeSize;
                $totalAfter += $afterSize;
                $processed++;
            } catch (\Throwable $e) {
                $failed++;
            }
        }

        $savedBytes = max(0, $totalBefore - $totalAfter);
        $savedPercent = $totalBefore > 0 ? round(($savedBytes / $totalBefore) * 100, 2) : 0.0;

        $this->newLine();
        $this->info("Processed: {$processed}");
        $this->line("Skipped: {$skipped}");
        $this->line("Failed: {$failed}");
        $this->line('Before: ' . $this->formatBytes($totalBefore));
        $this->line('After: ' . $this->formatBytes($totalAfter));
        $this->info('Saved: ' . $this->formatBytes($savedBytes) . " ({$savedPercent}%)");

        return self::SUCCESS;
    }

    private function encodeByExtension($image, string $extension, int $webpQuality): ?string
    {
        ob_start();

        $ok = match ($extension) {
            'jpg', 'jpeg' => imagejpeg($image, null, 78),
            'png' => imagepng($image, null, 8),
            'webp' => function_exists('imagewebp') ? imagewebp($image, null, $webpQuality) : false,
            default => false,
        };

        $binary = ob_get_clean();

        if (!$ok || $binary === false) {
            return null;
        }

        return $binary;
    }

    private function resizeToFit($sourceImage, int $maxWidth, int $maxHeight)
    {
        $sourceWidth = imagesx($sourceImage);
        $sourceHeight = imagesy($sourceImage);
        if ($sourceWidth <= 0 || $sourceHeight <= 0) {
            return null;
        }

        $ratio = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight, 1);
        $targetWidth = max(1, (int) floor($sourceWidth * $ratio));
        $targetHeight = max(1, (int) floor($sourceHeight * $ratio));

        $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);
        if (!$targetImage) {
            return null;
        }

        imagealphablending($targetImage, false);
        imagesavealpha($targetImage, true);
        $transparent = imagecolorallocatealpha($targetImage, 0, 0, 0, 127);
        imagefilledrectangle($targetImage, 0, 0, $targetWidth, $targetHeight, $transparent);

        $copied = imagecopyresampled(
            $targetImage,
            $sourceImage,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight
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

