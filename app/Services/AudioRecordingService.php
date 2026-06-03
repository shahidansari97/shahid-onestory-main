<?php

namespace App\Services;

use App\Contracts\Services\AudioRecordingServiceInterface;
use App\Models\AudioRecording;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AudioRecordingService implements AudioRecordingServiceInterface
{
    public function storeRecording(int $userId, ?UploadedFile $audioFile, string $publishType, ?float $duration, string $message, string $recordingType): array
    {
        $path = null;
        $url = null;
        $filename = null;

        if ($audioFile && $audioFile->isValid()) {
            $uuid = Str::uuid()->toString();
            $extension = $audioFile->getClientOriginalExtension() ?: 'wav';
            $filename = $uuid . '.' . $extension;
            $destinationPath = public_path('audio-recordings');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $audioFile->move($destinationPath, $filename);
            $path = 'audio-recordings/' . $filename;
            $url = asset($path);
        }

        $recording = AudioRecording::create([
            'user_id' => $userId,
            'path' => $path,
            'duration' => $duration,
            'publish_type' => $publishType,
            'message' => $message ?? '',
            'recording_type' => $recordingType,
            'status' => 1
        ]);

        return [
            'id' => $recording->id,
            'path' => $path,
            'url' => $url,
            'filename' => $filename,
            'duration' => $duration,
            'publish_type' => $recording->publish_type,
            'message' => $recording->message,
            'recording_type' => $recording->recording_type
        ];
    }

    public function getAllRecordings(int $page = 1, int $perPage = 12, ?string $search = null)
    {
        $query = AudioRecording::with('user:id,name,username,avatar,email','user.roles')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('path', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $recordings = $query->paginate($perPage, ['*'], 'page', $page);

        // Format recordings
        $formattedRecordings = $this->getFormattedRecordings($recordings->getCollection());
        $recordings->setCollection($formattedRecordings);

        return $recordings;
    }

    public function updateRecording(int $id, ?string $publishType = null, ?int $status = null): array
    {
        $recording = AudioRecording::findOrFail($id);

        if ($publishType !== null) {
            $recording->publish_type = $publishType;
        }

        if ($status !== null) {
            $recording->status = $status;
        }

        $recording->save();

        return [
            'id' => $recording->id,
            'publish_type' => $recording->publish_type,
            'status' => $recording->status
        ];
    }

    public function deleteRecording(int $id): bool
    {
        $recording = AudioRecording::findOrFail($id);

        // Delete file from public folder
        // $fullPath = public_path($recording->path);
        // if (file_exists($fullPath)) {
        //     unlink($fullPath);
        // }

        if (!empty($recording->path) && trim($recording->path) !== '') {
            $fullPath = public_path($recording->path);

            if (is_file($fullPath)) {
                unlink($fullPath);
            }
        }

        // Delete record from database
        $recording->delete();

        return true;
    }

    public function getRecordingById(int $id)
    {
        return AudioRecording::with('user')->findOrFail($id);
    }

    public function getLatestPublishedRecording(?string $publishType = 'public')
    {
        return AudioRecording::with('user')
            ->where('status', 1) // Published
            ->where('publish_type', $publishType)
            ->latest()
            ->first();
    }

    public function getFormattedRecordings(Collection $recordings): Collection
    {
        return $recordings->map(function ($recording) {
            return [
                'id' => $recording->id,
                'filename' => $recording->filename,
                'path' => $recording->path,
                'url' => $recording->url,
                'short_filename' => $recording->short_filename,
                'duration' => $recording->duration,
                'publish_type' => $recording->publish_type,
                'message' => $recording->message,
                'recording_type' => $recording->recording_type,
                'status' => $recording->status,
                'created_at' => $recording->created_at,
                'user' => $recording->user ? [
                    'id' => $recording->user->id,
                    'name' => $recording->user->name,
                    'username' => $recording->user->username,
                    'avatar' => $recording->user->avatar,
                    'email' => $recording->user->email,
                    'roles' => $recording->user->getRoleNames()->first(),
                ] : null,
            ];
        });
    }
}
