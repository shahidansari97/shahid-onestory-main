<?php

namespace App\Http\Controllers;

use App\Support\PublicStorageSync;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    protected $fileTypes = [
        'avatar' => 'users-avatar',
        'image' => 'images',
        'cover_image' => 'cover-images',
        'video' => 'videos',
    ];

    public function file(Request $request)
    {
        $allowedType = $request->input('allowed_types', 'image');
        
        $folder = $this->fileTypes[$allowedType] ?? 'uploads';
        
        if ($request->has('imageUrl')) {
            return $this->uploadFromUrl(
                $request->input('imageUrl'),
                $folder,
                $allowedType,
                $request->input('current_path')
            );
        }

        return $this->uploadFromFile($request, $allowedType, $folder);
    }

    protected function uploadFromFile(Request $request, $allowedType, $folder)
    {
        $validationRules = ['file' => 'required'];

        if (in_array($allowedType, ['image', 'avatar', 'cover_image'], true)) {
            $validationRules['file'] .= '|image|max:15360';
        } elseif ($allowedType === 'video') {
            $validationRules['file'] .= '|mimes:mp4,mov,avi,flv,mkv';
        }

        $request->validate($validationRules);

        $file = $request->file('file');
        $path = null;
        $currentPath = $request->input('current_path');

        if (in_array($allowedType, ['avatar', 'cover_image'], true)) {
            $path = $this->storeAsWebpFromFile($file, $folder, $allowedType, $currentPath);
            if (! $path) {
                $path = $this->storeOriginalImageFile($file, $folder, $allowedType, $currentPath);
            }
        }

        if (! $path) {
            $path = $file->store($folder, 'public');
        }

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return response()->json([
                'error' => 'Unable to save image on the server.',
            ], 500);
        }

        $this->ensureExistsInPublicStoragePath($path);

        $url = $this->publicUrlForStoragePath($path);

        return response()->json(['url' => $url, 'fileName' => basename($path)]);
    }

    protected function uploadFromUrl($imageUrl, $folder, $allowedType = 'image', $currentPath = null)
    {
        $client = new Client();
        $response = $client->get($imageUrl);

        if ($response->getStatusCode() === 200) {
            $imageContent = $response->getBody()->getContents();
            $path = null;

            if (in_array($allowedType, ['avatar', 'cover_image'], true)) {
                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH) ?: 'image');
                $path = $this->storeAsWebpFromBinary($imageContent, $folder, $allowedType, $originalName, $currentPath);
                if (! $path) {
                    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION) ?: 'jpg');
                    $baseName = $this->resolveBaseNameForPath($folder, $currentPath, $originalName, $allowedType);
                    $path = $folder . '/' . $baseName . '.' . ($extension ?: 'jpg');
                    Storage::disk('public')->put($path, $imageContent);
                    PublicStorageSync::copyToWebRoot($path);
                    $this->deletePreviousIfDifferent($folder, $currentPath, $path);
                }
            }

            if (!$path) {
                $imageName = basename($imageUrl);
                $path = $folder . "/" . uniqid() . "_" . $imageName;
                Storage::disk('public')->put($path, $imageContent);
            }

            if (in_array($allowedType, ['avatar', 'cover_image'], true)) {
                $this->ensureExistsInPublicStoragePath($path);
            }

            $url = $this->publicUrlForStoragePath($path);

            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'Failed to save image'], 500);
    }

    private function storeAsWebpFromFile($file, string $folder, string $allowedType = 'image', ?string $currentPath = null): ?string
    {
        if (!$file || !$file->isValid()) {
            return null;
        }

        $binary = @file_get_contents($file->getRealPath());
        if ($binary === false) {
            return null;
        }

        return $this->storeAsWebpFromBinary(
            $binary,
            $folder,
            $allowedType,
            $file->getClientOriginalName(),
            $currentPath
        );
    }

    private function storeAsWebpFromBinary(
        string $binary,
        string $folder,
        string $allowedType = 'image',
        string $originalName = 'image',
        ?string $currentPath = null
    ): ?string
    {
        if (!extension_loaded('gd') || !function_exists('imagecreatefromstring') || !function_exists('imagewebp')) {
            return null;
        }

        $image = @imagecreatefromstring($binary);
        if (!$image) {
            return null;
        }

        if (function_exists('imagepalettetotruecolor') && !imageistruecolor($image)) {
            @imagepalettetotruecolor($image);
        }
        imagealphablending($image, true);
        imagesavealpha($image, true);

        if ($allowedType === 'avatar') {
            $optimized = $this->resizeAndCropSquare($image, 160);
            imagedestroy($image);
            if (! $optimized) {
                return null;
            }
            $image = $optimized;
        } elseif ($allowedType === 'cover_image') {
            $optimized = $this->resizeToMaxDimension($image, 1920, 1080);
            if ($optimized && $optimized !== $image) {
                imagedestroy($image);
                $image = $optimized;
            }
        }

        $baseName = $this->resolveBaseNameForPath($folder, $currentPath, $originalName, $allowedType);
        $path = $folder . '/' . $baseName . '.webp';

        ob_start();
        $quality = $allowedType === 'avatar' ? 76 : 82;
        $ok = imagewebp($image, null, $quality);
        $webp = ob_get_clean();
        imagedestroy($image);

        if (!$ok || $webp === false) {
            return null;
        }

        Storage::disk('public')->put($path, $webp);
        PublicStorageSync::copyToWebRoot($path);
        $this->deletePreviousIfDifferent($folder, $currentPath, $path);

        return $path;
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

    private function resizeToMaxDimension($sourceImage, int $maxWidth, int $maxHeight)
    {
        $sourceWidth = imagesx($sourceImage);
        $sourceHeight = imagesy($sourceImage);

        if ($sourceWidth <= 0 || $sourceHeight <= 0 || $maxWidth <= 0 || $maxHeight <= 0) {
            return null;
        }

        $scale = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight, 1);

        if ($scale >= 1) {
            return $sourceImage;
        }

        $targetWidth = max(1, (int) round($sourceWidth * $scale));
        $targetHeight = max(1, (int) round($sourceHeight * $scale));

        $targetImage = imagecreatetruecolor($targetWidth, $targetHeight);
        if (! $targetImage) {
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

        if (! $copied) {
            imagedestroy($targetImage);

            return null;
        }

        return $targetImage;
    }

    private function resolveBaseNameForPath(string $folder, ?string $currentPath, string $originalName, string $allowedType = 'image'): string
    {
        if ($allowedType === 'avatar') {
            $baseName = pathinfo($originalName, PATHINFO_FILENAME) ?: 'avatar';
            $safeBaseName = Str::slug($baseName, '_') ?: 'avatar';

            return uniqid('avatar_', true) . '_' . $safeBaseName;
        }

        if ($allowedType === 'cover_image') {
            $baseName = pathinfo($originalName, PATHINFO_FILENAME) ?: 'cover';
            $safeBaseName = Str::slug($baseName, '_') ?: 'cover';

            return uniqid('cover_', true) . '_' . $safeBaseName;
        }

        $existingBase = $this->extractBaseNameFromCurrentPath($folder, $currentPath);
        if ($existingBase) {
            return $existingBase;
        }

        $baseName = pathinfo($originalName, PATHINFO_FILENAME) ?: 'image';
        $safeBaseName = Str::slug($baseName, '_') ?: 'image';

        return uniqid() . '_' . $safeBaseName;
    }

    private function extractBaseNameFromCurrentPath(string $folder, ?string $currentPath): ?string
    {
        if (!$currentPath) {
            return null;
        }

        $path = parse_url($currentPath, PHP_URL_PATH) ?: $currentPath;
        $path = trim((string) $path);
        $prefix = '/storage/' . trim($folder, '/') . '/';
        if ($path === '' || !str_starts_with($path, $prefix)) {
            return null;
        }

        $filename = basename($path);
        $base = pathinfo($filename, PATHINFO_FILENAME);
        return $base ?: null;
    }

    private function deletePreviousIfDifferent(string $folder, ?string $currentPath, string $newPath): void
    {
        if (!$currentPath) {
            return;
        }

        $path = parse_url($currentPath, PHP_URL_PATH) ?: $currentPath;
        $prefix = '/storage/' . trim($folder, '/') . '/';
        if (!str_starts_with((string) $path, $prefix)) {
            return;
        }

        $oldRelative = ltrim(substr((string) $path, strlen('/storage/')), '/');
        if ($oldRelative === '' || $oldRelative === $newPath) {
            return;
        }

        if (Storage::disk('public')->exists($oldRelative)) {
            Storage::disk('public')->delete($oldRelative);
        }

        $oldPublicPath = public_path('storage/' . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $oldRelative));
        if (is_file($oldPublicPath)) {
            @unlink($oldPublicPath);
        }
    }

    private function storeOriginalImageFile($file, string $folder, string $allowedType, ?string $currentPath = null): ?string
    {
        if (! $file || ! $file->isValid()) {
            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
            $extension = 'jpg';
        }

        $baseName = $this->resolveBaseNameForPath(
            $folder,
            $currentPath,
            $file->getClientOriginalName(),
            $allowedType
        );

        $stored = $file->storeAs($folder, $baseName . '.' . $extension, 'public');

        if ($stored) {
            PublicStorageSync::copyToWebRoot($stored);
            $this->deletePreviousIfDifferent($folder, $currentPath, $stored);
        }

        return $stored ?: null;
    }

    private function ensureExistsInPublicStoragePath(string $relativePath): bool
    {
        if (! PublicStorageSync::copyToWebRoot($relativePath)) {
            Log::warning('Could not mirror file to public/storage; ensure php artisan storage:link is run.', [
                'path' => $relativePath,
            ]);
        }

        return Storage::disk('public')->exists($relativePath);
    }

    private function publicUrlForStoragePath(string $relativePath): string
    {
        $normalized = ltrim(str_replace('\\', '/', $relativePath), '/');

        return '/storage/' . $normalized;
    }
}
