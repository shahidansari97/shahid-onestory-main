<?php

namespace App\Services;

use App\Models\EditorDraft;
use App\Models\EditorMedia;
use App\Models\AutoSave;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class DraftService
{
    /**
     * Save draft data to MySQL instead of IndexedDB
     */
    public function saveDraftData($draftData, $userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        // Check if user already has a draft
        $existingDraft = EditorDraft::where('user_id', $userId)->first();

        if ($existingDraft) {
            // Update existing draft
            $existingDraft->update([
                'draft_data' => json_encode($draftData),
                'updated_at' => now()
            ]);
            
            return [
                'success' => true,
                'message' => 'Draft updated successfully',
                'draft_id' => $existingDraft->id
            ];
        } else {
            // Create new draft
            $draft = EditorDraft::create([
                'user_id' => $userId,
                'draft_data' => json_encode($draftData),
                'filename' => 'draft_' . Str::uuid() . '.json',
                'path' => 'drafts/draft_' . Str::uuid() . '.json' // Keep for compatibility
            ]);
            
            return [
                'success' => true,
                'message' => 'Draft saved successfully',
                'draft_id' => $draft->id
            ];
        }
    }

    /**
     * Load draft data from MySQL
     */
    public function loadDraftData($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated',
                'data' => null
            ];
        }

        $draft = EditorDraft::where('user_id', $userId)->where('status', '!=', '1')->first();

        if (!$draft) {
            return [
                'success' => true,
                'message' => 'No draft found',
                'data' => null
            ];
        }

        $draftData = json_decode($draft->draft_data, true);

        return [
            'success' => true,
            'message' => 'Draft loaded successfully',
            'data' => $draftData,
            'draft_id' => $draft->id,
            'updated_at' => $draft->updated_at
        ];
    }

    /**
     * Save user media to MySQL instead of IndexedDB
     */
    public function saveUserMedia($mediaData, $userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        try {
            // Handle transitions and effects (only one per user)
            if ($mediaData['type'] == 'transition' || $mediaData['type'] == 'effect') {
                $existingMedia = EditorMedia::where([
                    'userId' => $userId,
                    'type' => $mediaData['type']
                ])->first();

                if ($existingMedia) {
                    $existingMedia->update([
                        'name' => $mediaData['name'],
                        'serverPath' => $mediaData['url'] ?? $existingMedia->serverPath,
                        'thumbnail' => $mediaData['thumbnails'] ?? $existingMedia->thumbnail,
                    ]);
                    return [
                        'success' => true,
                        'message' => ucfirst($mediaData['type']) . ' updated successfully',
                        'media' => $existingMedia
                    ];
                }
            }

            // Create new media entry
            $media = EditorMedia::create([
                'userId' => $userId,
                'projectId' => $mediaData['projectId'] ?? null,
                'type' => $mediaData['type'],
                'serverPath' => $mediaData['url'] ?? $mediaData['serverPath'] ?? null,
                'thumbnail' => $mediaData['thumbnails'] ?? $mediaData['thumbnail'] ?? null,
                'name' => $mediaData['name'],
                'size' => $mediaData['size'] ?? 0,
                'duration' => $mediaData['duration'] ?? 0,
                'lastModified' => $mediaData['lastModified'] ?? now(),
                'createdAt' => now()
            ]);

            return [
                'success' => true,
                'message' => 'Media saved successfully',
                'media' => $media
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error saving media: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Resolve a stored media path to a playable URL.
     */
    private function resolveMediaUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        $path = trim($path);
        if ($path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, 'blob:') || str_starts_with($path, 'data:')) {
            return $path;
        }

        $base = rtrim((string) env('CLOUDFRONT_BASE_URL', ''), '/');
        return $base !== '' ? $base . '/' . ltrim($path, '/') : $path;
    }

    /**
     * Get the best available draft preview video URL for the current user.
     */
    public function getPreviewVideoUrl($userId = null): array
    {
        $userId = $userId ?? Auth::id();

        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated',
                'videoUrl' => null,
            ];
        }

        try {
            $media = EditorMedia::where('userId', $userId)
                ->where('status', '!=', 1)
                ->whereIn('type', ['user_video', 'video'])
                ->orderBy('createdAt', 'desc')
                ->first();

            if ($media) {
                $videoUrl = $this->resolveMediaUrl($media->serverPath);

                if ($videoUrl) {
                    return [
                        'success' => true,
                        'videoUrl' => $videoUrl,
                        'thumbnail' => $media->thumbnail,
                        'lastModified' => $media->lastModified,
                    ];
                }
            }

            $autoSave = AutoSave::where('userId', $userId)
                ->orderBy('timestamp', 'desc')
                ->first();

            if ($autoSave) {
                $editorState = is_string($autoSave->editorState)
                    ? json_decode($autoSave->editorState, true)
                    : $autoSave->editorState;

                $overlays = $editorState['overlays'] ?? [];

                foreach (array_reverse($overlays) as $overlay) {
                    $type = $overlay['type'] ?? '';
                    $src = $overlay['src'] ?? '';

                    if (in_array($type, ['user_video', 'video'], true) && $src) {
                        $videoUrl = $this->resolveMediaUrl($src);

                        if ($videoUrl) {
                            return [
                                'success' => true,
                                'videoUrl' => $videoUrl,
                                'lastModified' => $autoSave->timestamp,
                            ];
                        }
                    }
                }
            }

            return [
                'success' => true,
                'videoUrl' => null,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error loading preview video: ' . $e->getMessage(),
                'videoUrl' => null,
            ];
        }
    }

    /**
     * Check whether the user has a saved draft video.
     */
    public function hasDraftVideo($userId = null): bool
    {
        $result = $this->getPreviewVideoUrl($userId);

        return ($result['success'] ?? false) && !empty($result['videoUrl']);
    }

    /**
     * Get user media from MySQL instead of IndexedDB
     */
    public function getUserMedia($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated',
                'media' => []
            ];
        }

        try {
            $media = EditorMedia::where('userId', $userId)->where('status', '!=', 1)
                ->select('id', 'userId', 'projectId', 'name', 'type', 'serverPath', 'size', 'lastModified', 'thumbnail', 'duration', 'createdAt')
                ->orderBy('createdAt', 'desc')
                ->get();

            return [
                'success' => true,
                'message' => 'Media loaded successfully',
                'media' => $media
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error loading media: ' . $e->getMessage(),
                'media' => []
            ];
        }
    }

    /**
     * Clear user media from MySQL
     */
    public function clearUserMedia($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        try {
            $deletedCount = EditorMedia::where('userId', $userId)->delete();
            $this->clearAutoSave($userId);
            return [
                'success' => true,
                'message' => "Cleared {$deletedCount} media items successfully"
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error clearing media: ' . $e->getMessage()
            ];
        }
    }
    
    public function clearAutoSave($userId) {
        $autoSaveData = AutoSave::where('userId', $userId)->first();
        $editorState = json_decode($autoSaveData->editorState, true);
        $editorState['overlays'] = [];
        $autoSaveData->editorState = json_encode($editorState);
        $updateData = [
            'editorState' => $autoSaveData->editorState,
            'timestamp' => time(),
            'projectId' => $autoSaveData->projectId,
            'userId' => $autoSaveData->userId
        ];
        return AutoSave::where('userId', $userId)->update($updateData);
    }
    /**
     * Delete specific media item
     */
    public function deleteMedia($mediaId, $userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        try {
            $deleted = EditorMedia::where('id', $mediaId)
                ->where('userId', $userId)
                ->delete();

            if ($deleted) {
                return [
                    'success' => true,
                    'message' => 'Media deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Media not found or access denied'
                ];
            }

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error deleting media: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Update media item
     */
    public function updateMedia($mediaId, $updateData, $userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        try {
            $media = EditorMedia::where('id', $mediaId)
                ->where('userId', $userId)
                ->first();

            if (!$media) {
                return [
                    'success' => false,
                    'message' => 'Media not found or access denied'
                ];
            }

            $media->update($updateData);

            return [
                'success' => true,
                'message' => 'Media updated successfully',
                'media' => $media
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating media: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Check if user has draft data
     */
    public function hasDraft($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return false;
        }

        return EditorDraft::where('user_id', $userId)->where('status', '!=', '1')->exists();
    }

    /**
     * Delete draft data
     */
    public function deleteDraft($userId = null)
    {
        $userId = $userId ?? Auth::id();
        
        if (!$userId) {
            return [
                'success' => false,
                'message' => 'User not authenticated'
            ];
        }

        try {
            $deleted = EditorDraft::where('user_id', $userId)->delete();
            
            return [
                'success' => true,
                'message' => 'Draft deleted successfully'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error deleting draft: ' . $e->getMessage()
            ];
        }
    }
}
