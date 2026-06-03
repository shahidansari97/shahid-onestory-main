<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SceneController extends Controller
{
    public function saveScene(Request $request)
    {
        $scene = $request->input('scene');
        Storage::put('scenes/user-scene.json', json_encode($scene));
        return response()->json(['message' => 'Scene saved successfully']);
    }

    public function loadScene()
    {
        if (Storage::exists('scenes/user-scene.json')) {
            $scene = json_decode(Storage::get('scenes/user-scene.json'), true);
            return response()->json(['scene' => $scene]);
        }

        return response()->json(['scene' => null]);
    }
}
