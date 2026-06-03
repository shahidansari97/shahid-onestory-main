<?php

namespace App\Services;

use App\Contracts\Services\VideoEditorServiceInterface;
use App\Models\EditorDraft;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
class VideoEditorService implements VideoEditorServiceInterface
{
    public function uploadMedia(Request $request)
    {
        $validationRules = [
            'file' => 'required|mimes:jpg,jpeg,png,gif,mp4,avi,mov,mp3,wav|max:500480'
        ];
        $request->validate($validationRules);

        $file = $request->file('file');
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            $folder = 'images';
        } elseif (str_starts_with($mimeType, 'video/')) {
            $folder = 'videos';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            $folder = 'audios';
        } else {
            return response()->json([
                'message' => 'Unsupported type',
                'success' => false,
            ], 400);
        }

        $path = $request->file('file')->store($folder, 'public');
        $url  = Storage::url($path);

        return response()->json([
            'url'      => $url,
            'fileName' => basename($path),
            'success'  => true,
        ]);
    }

    public function saveDraft($file)
    {
        $userId = Auth::id();
        $existingDraft = EditorDraft::where('user_id', $userId)->first();

        if ($existingDraft) {
            if (Storage::exists($existingDraft->path)) {
                Storage::delete($existingDraft->path);
            }
            $existingDraft->delete();
        }

        $fileName = Str::uuid()->toString() . '.json';
        $path     = $file->storeAs('public/drafts', $fileName);
        $url      = Storage::url('drafts/' . $fileName);

        $draft = EditorDraft::create([
            'user_id'  => $userId,
            'filename' => $fileName,
            'path'     => $path,
        ]);

        return [
            'fileName' => $fileName,
            'url'      => $url,
            'thumbUrl' => $url,
            'success'  => true,
        ];
    }
}
