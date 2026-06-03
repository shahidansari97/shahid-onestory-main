<?php

namespace App\Contracts\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

interface AudioRecordingServiceInterface
{
    public function storeRecording(int $userId, ?UploadedFile $audioFile, string $publishType, ?float $duration, string $message, string $recordingType): array;

    public function getAllRecordings(int $page = 1, int $perPage = 12, ?string $search = null);

    public function updateRecording(int $id, ?string $publishType = null, ?int $status = null): array;

    public function deleteRecording(int $id): bool;

    public function getRecordingById(int $id);

    public function getLatestPublishedRecording(?string $publishType = 'public');

    public function getFormattedRecordings(Collection $recordings): Collection;
}
