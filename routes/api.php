<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoryController;

Route::prefix('/stories')->group(function () {
    Route::post('/store', [StoryController::class, 'store']);
});