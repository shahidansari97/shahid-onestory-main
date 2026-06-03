<?php

namespace App\Http\Controllers;

use App\Services\DraftService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DraftController extends Controller
{
    public function __construct(
        private DraftService $draftService
    ) {}

    /**
     * Save draft data
     */
    public function saveDraft(Request $request): JsonResponse
    {
        // $request->validate([
        //     'draft_data' => 'required|array'
        // ]);

        // $result = $this->draftService->saveDraftData($request->draft_data);

        // return response()->json($result);
    }

    /**
     * Load draft data
     */
    public function loadDraft(): JsonResponse
    {
        $result = $this->draftService->loadDraftData();

        return response()->json($result);
    }

    /**
     * Save user media
     */
    public function saveMedia(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
            'serverPath' => 'nullable|string',
            'url' => 'nullable|string', // For backward compatibility with old requests
            'thumbnail' => 'nullable|string',
            'thumbnails' => 'nullable|string', // For backward compatibility
            'projectId' => 'nullable|string',
            'size' => 'nullable|numeric',
            'duration' => 'nullable|numeric',
            'lastModified' => 'nullable|string'
        ]);

        $result = $this->draftService->saveUserMedia($request->all());

        return response()->json($result);
    }

    /**
     * Get user media
     */
    public function getMedia(): JsonResponse
    {
        $result = $this->draftService->getUserMedia();

        return response()->json($result);
    }

    /**
     * Get draft preview video URL
     */
    public function getPreviewVideo(): JsonResponse
    {
        $result = $this->draftService->getPreviewVideoUrl();

        return response()->json($result);
    }

    /**
     * Check if user has a saved draft video
     */
    public function hasDraftVideo(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'hasDraftVideo' => $this->draftService->hasDraftVideo(),
        ]);
    }

    /**
     * Clear user media
     */
    public function clearMedia(): JsonResponse
    {
        $result = $this->draftService->clearUserMedia();

        return response()->json($result);
    }

    /**
     * Delete specific media
     */
    public function deleteMedia(Request $request): JsonResponse
    {
        $request->validate([
            'media_id' => 'required|integer|exists:user_media,id'
        ]);

        $result = $this->draftService->deleteMedia($request->media_id);

        return response()->json($result);
    }

    /**
     * Update media
     */
    public function updateMedia(Request $request): JsonResponse
    {
        $request->validate([
            'media_id' => 'required|integer|exists:user_media,id',
            'serverPath' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'duration' => 'nullable|numeric',
            'name' => 'nullable|string',
            'size' => 'nullable|numeric'
        ]);

        $mediaId = $request->media_id;
        $updateData = $request->except(['media_id']);

        $result = $this->draftService->updateMedia($mediaId, $updateData);

        return response()->json($result);
    }

    /**
     * Check if user has draft
     */
    public function hasDraft(): JsonResponse
    {
        $hasDraft = $this->draftService->hasDraft();

        return response()->json([
            'success' => true,
            'has_draft' => $hasDraft
        ]);
    }

    /**
     * Delete draft
     */
    public function deleteDraft(): JsonResponse
    {
        $result = $this->draftService->deleteDraft();

        return response()->json($result);
    }
}
