<?php

namespace App\Http\Controllers;

use App\Contracts\Services\VideoEditorServiceInterface;
use Illuminate\Http\Request;

class VideoEditorController extends Controller
{
    public function __construct(
        private VideoEditorServiceInterface $videoEditorService
    ) {}

    public function upload(Request $request)
    {
        return $this->videoEditorService->uploadMedia($request);
    }

    public function saveDraft(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded.'], 400);
        }

        if ($request->input('allowed_types') !== 'json') {
            return response()->json([
                'success' => false,
                'message' => 'File type not allowed.'
            ], 400);
        }

        $result = $this->videoEditorService->saveDraft($request->file('file'));

        return response()->json($result);
    }
}
