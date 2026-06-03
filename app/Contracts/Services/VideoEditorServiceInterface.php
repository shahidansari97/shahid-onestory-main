<?php

namespace App\Contracts\Services;

use Illuminate\Http\Request;

interface VideoEditorServiceInterface
{
    public function uploadMedia(Request $request);

    public function saveDraft($file);
}
