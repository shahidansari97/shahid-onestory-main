<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class PublicStorageSync
{
    /**
     * Copy a file from storage/app/public into public/storage for /storage/... URLs.
     */
    public static function copyToWebRoot(string $relativePath): bool
    {
        $relativePath = ltrim(str_replace('\\', '/', $relativePath), '/');

        if ($relativePath === '' || ! Storage::disk('public')->exists($relativePath)) {
            return false;
        }

        $source = Storage::disk('public')->path($relativePath);
        $destination = public_path('storage/' . str_replace('/', DIRECTORY_SEPARATOR, $relativePath));

        if (is_file($destination) && @filesize($destination) > 0) {
            return true;
        }

        $directory = dirname($destination);
        if (! is_dir($directory) && ! @mkdir($directory, 0755, true) && ! is_dir($directory)) {
            return false;
        }

        return @copy($source, $destination);
    }
}
