<?php

namespace App\Services;

use App\Contracts\Services\SupportServiceInterface;
use App\Models\Commission;
use App\Models\Support;
use App\Models\SupportImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SupportService implements SupportServiceInterface
{
    public function all(): array
    {
        return Support::all()->toArray();
    }

    public function getSupportData(): array
    {
        $support = DB::table('support')->where('key', 'content')->first();
        $content = json_decode($support->value, true);
        $content['images'] = $this->getImages();

        $commission = Commission::first();
        $content['amount'] = $commission->charity_funds;
        return ['content' => $content];
    }

    public function getImages(): array
    {
        $images = SupportImage::all();

        return $images->map(function ($image) {
            return [
                'id' => $image->id,
                'src' => Storage::disk('public')->url('support/images/' . $image->src),
            ];
        })->toArray();
    }

    public function updateSupportPage($content = null, $images = null): array
    {
        DB::table('support')
            ->updateOrInsert(
                ['key' => 'content'],
                ['value' => json_encode($content)]
            );

        if ($images) {
            foreach ($images as $image) {
                $uuid = Str::uuid()->toString();
                $extension = $image->getClientOriginalExtension();
                $filename = $uuid . '.' . $extension;

                $image->storeAs('support/images', $filename, 'public');

                SupportImage::create([
                    'src' => $filename,
                ]);
            }
        }

        return ['success' => 'Page has been updated.'];
    }

    public function deleteImage($id): array
    {
        $image = SupportImage::find($id);

        if (!$image) {
            return ['error' => 'Image not found.'];
        }

        if (!Storage::disk('public')->delete('support/images/' . $image->src)) {
            return ['error' => 'Error occurred while removing image.'];
        }

        $image->delete();

        return ['success' => 'Image has been removed.'];
    }
}
