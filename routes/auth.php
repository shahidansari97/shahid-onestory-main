<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\OAuth\FacebookSocialController;
use App\Http\Controllers\Auth\OAuth\GoogleSocialController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// OAuth must work even when session state is limited (common on iOS Safari).
Route::controller(FacebookSocialController::class)->group(function () {
    Route::get('/auth/facebook/redirect', 'redirect')->name('oauth2.facebook.redirect');
    Route::get('/auth/facebook/callback', 'callback')->name('oauth2.facebook.callback');
});

Route::controller(GoogleSocialController::class)->group(function () {
    Route::get('/auth/google/redirect', 'redirect')->name('oauth2.google.redirect');
    Route::get('/auth/google/callback', 'callback')->name('oauth2.google.callback');
});

Route::middleware('guest')->group(function () {
    Route::get('register/{is_contestant?}', [RegisteredUserController::class, 'create'])
                ->name('register');
                
    Route::get('creator', [RegisteredUserController::class, 'creator'])
                ->name('creator');

    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::post('creator-store', [RegisteredUserController::class, 'creatorStore'])->name('creator-store');

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->name('password.store');

});

Route::middleware('auth')->group(function () {
    Route::get('creator/upgrade', [RegisteredUserController::class, 'upgradeCreator'])
                ->name('creator.upgrade');
    Route::post('creator-upgrade', [RegisteredUserController::class, 'upgradeCreatorStore'])
                ->name('creator-upgrade');

    Route::get('verify-email', EmailVerificationPromptController::class)
                ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
                ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');
});
