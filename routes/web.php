<?php

use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\Admin\BlacklistedWordController;
use App\Http\Controllers\Admin\CameraEventController;
use App\Http\Controllers\Admin\ReplaceVideoController;
use App\Http\Controllers\AdminUsersDashboardController;
use App\Http\Controllers\ConnectWithUsController;
use App\Http\Controllers\CreatorGuidelinesController;
use App\Http\Controllers\Auth\OAuth\FacebookSocialController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonatePageController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\DonationPopupController;
use App\Http\Controllers\GiftTransactionController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\ImageGenerationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\PollPopupController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\PrivacyPolicyUsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AudioRecordingController;
use App\Http\Controllers\StoryViewController;
use App\Http\Controllers\SiteSettingsController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\StoryStatusController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\TermsOfUseController;
use App\Http\Controllers\TransactionPageController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\VariantController;
use App\Http\Controllers\VideoEditorController;
use App\Http\Controllers\Webhooks\StripeWebhookController;
use App\Http\Middleware\HandlePayoutRequest;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\PayPalAuthController;
use App\Http\Controllers\Webhooks\PayPalWebhookController;
use App\Http\Controllers\Admin\UserLoginLogController;
use App\Http\Controllers\Admin\VisitorController;
use App\Http\Controllers\Admin\SpokenStoryRecordingController;
use App\Http\Controllers\WrittenMessageController;
use App\Http\Controllers\WrittenMessageCommentController;
use App\Http\Controllers\SpokenStoryCommentController;
use App\Http\Controllers\SpokenStoryController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Admin actions
 */



Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');
    Route::post('/dashboard/update', [DashboardController::class, 'update'])->name('admin.dashboard.update');

    Route::prefix('/users')->group(function () {
        Route::get('/', [AdminUsersDashboardController::class, 'index'])->name('admin.users.index');
        Route::get('/{id}/', [AdminUsersDashboardController::class, 'show'])->name('admin.users.show');
        Route::delete('/{id}/delete', [AdminUsersDashboardController::class, 'delete'])->name('admin.users.delete');
        Route::get('/{id}/edit', [AdminUsersDashboardController::class, 'edit'])->name('admin.users.edit');
        Route::post('/{id}/update', [AdminUsersDashboardController::class, 'update'])->name('admin.users.update');
        Route::post('/{id}/update-status', [AdminUsersDashboardController::class, 'updateStatus'])->name('admin.users.update-status');
        Route::post('/{id}/update-creator-status', [AdminUsersDashboardController::class, 'updateCreatorStatus'])->name('admin.users.update-creator-status');
    });

    Route::get('/user-login-logs', [UserLoginLogController::class, 'index'])
        ->name('admin.user-login-logs.index');

    Route::get('/camera-events', [CameraEventController::class, 'index'])
        ->name('admin.camera-events.index');

    Route::get('/visitors', [VisitorController::class, 'index'])
        ->name('admin.visitors.index');
    Route::get('/visitors/{visitor}', [VisitorController::class, 'show'])
        ->name('admin.visitors.show');
    Route::get('/visitors/{visitor}/logs', [VisitorController::class, 'logs'])
        ->name('admin.visitors.logs');
    Route::post('/visitors/delete', [VisitorController::class, 'delete'])
        ->name('admin.visitors.delete');

    Route::prefix('/homepage')->group(function () {
        Route::get('/edit', [HomepageController::class, 'edit'])->name('homepage.edit');
        Route::post('/update', [HomepageController::class, 'update'])->name('homepage.update');
        Route::post('/stories-editor/update-order', [HomepageController::class, 'updateStoryOrder'])->name('homepage.stories-editor.update-order');
        Route::get('/stories-editor', [HomepageController::class, 'storiesEditorIndex'])->name('homepage.stories-editor.index');
    });

    Route::prefix('/site-settings')->group(function () {
        Route::get('/edit', [SiteSettingsController::class, 'edit'])->name('admin.site-settings.edit');
        Route::post('/update', [SiteSettingsController::class, 'update'])->name('admin.site-settings.update');
    });

    Route::prefix('/privacy-policy')->group(function () {
        Route::get('/edit', [PrivacyPolicyController::class, 'edit'])->name('admin.privacy-policy.edit');
        Route::post('/update', [PrivacyPolicyController::class, 'update'])->name('admin.privacy-policy.update');
    });
    Route::prefix('/privacy-policy-us')->group(function () {
        Route::get('/edit', [PrivacyPolicyUsController::class, 'edit'])->name('admin.privacy-policy.us.edit');
        Route::post('/update', [PrivacyPolicyUsController::class, 'update'])->name('admin.privacy-policy.us.update');
    });

    Route::prefix('/terms-of-use')->group(function () {
        Route::get('/edit', [TermsOfUseController::class, 'edit'])->name('admin.terms-of-use.edit');
        Route::post('/update', [TermsOfUseController::class, 'update'])->name('admin.terms-of-use.update');
    });

    Route::prefix('/creator-guidelines')->group(function () {
        Route::get('/edit', [CreatorGuidelinesController::class, 'edit'])->name('admin.creator-guidelines.edit');
        Route::post('/update', [CreatorGuidelinesController::class, 'update'])->name('admin.creator-guidelines.update');
    });

    Route::prefix('/support')->group(function () {
        Route::get('/edit', [SupportController::class, 'edit'])->name('admin.support.edit');
        Route::post('/update', [SupportController::class, 'update'])->name('admin.support.update');
        Route::delete('/delete-image', [SupportController::class, 'deleteImage'])->name('admin.support.delete-image');
    });

    Route::prefix('/about')->group(function () {
        Route::get('/edit', [AboutPageController::class, 'edit'])->name('admin.about.edit');
        Route::post('/update', [AboutPageController::class, 'update'])->name('admin.about.update');
    });

    Route::prefix('/poll')->group(function () {
        Route::get('/', [PollController::class, 'index'])->name('admin.poll.index');
        Route::get('/create', [PollController::class, 'create'])->name('admin.poll.create');
        Route::post('/store', [PollController::class, 'store'])->name('admin.poll.store');
        Route::get('/{pollId}/edit ', [PollController::class, 'edit'])->name('admin.poll.edit');
        Route::post('/{pollId}/update', [PollController::class, 'update'])->name('admin.poll.update');
        Route::post('/delete', [PollController::class, 'delete'])->name('admin.delete.poll');
        Route::get('/{pollId}', [PollController::class, 'show'])->name('admin.poll.show');
        Route::post('/{poll}/change-status', [PollController::class, 'changeStatus'])->name('poll.change-status');
    });
    Route::prefix('/variants')->group(function () {
        Route::get('/', [VariantController::class, 'index'])->name('admin.variant.index');
        Route::get('/create', [VariantController::class, 'create'])->name('admin.variant.create');
        Route::post('/store', [VariantController::class, 'store'])->name('admin.variant.store');
        Route::get('/{variantId}/edit', [VariantController::class, 'edit'])->name('admin.variant.edit');
        Route::post('/{variantId}/update', [VariantController::class, 'update'])->name('admin.variant.update');
        Route::post('/delete', [VariantController::class, 'delete'])->name('admin.delete.variant');
        Route::get('/{variantId}', [VariantController::class, 'show'])->name('admin.variant.show');
    });

    Route::prefix('/donate-page')->group(function () {
        Route::get('/edit', [DonatePageController::class, 'edit'])->name('admin.donate-page.edit');
        Route::post('/update', [DonatePageController::class, 'update'])->name('admin.donate-page.update');
    });

    Route::prefix('donation-popup')->group(function () {
        Route::get('/edit', [DonationPopupController::class, 'edit'])->name('admin.donation-popup.edit');
        Route::post('/update', [DonationPopupController::class, 'update'])->name('admin.donation-popup.update');
    });

    Route::prefix('poll-popup')->group(function () {
        Route::get('/edit', [PollPopupController::class, 'edit'])->name('admin.poll-popup.edit');
        Route::post('/update', [PollPopupController::class, 'update'])->name('admin.poll-popup.update');
    });

    Route::prefix('/stories')->group(function () {
        Route::get('/', [StoryController::class, 'adminAllStories'])->name('admin.stories.all');
        Route::get('/replace-video', [ReplaceVideoController::class, 'index'])->name('admin.stories.replace-video');
        Route::post('/replace-video', [ReplaceVideoController::class, 'replace'])->name('admin.stories.replace-video');
        Route::post('/total-share', [StoryController::class, 'adminSetTotalShare'])->name('admin.stories.total-share');
        Route::get('/{id}', [StoryController::class, 'show'])->name('admin.stories.show');
        Route::get('/{id}/edit', [StoryController::class, 'edit'])->name('admin.stories.edit');
        Route::post('/{id}/update', [StoryController::class, 'update'])->name('admin.stories.update');
        Route::post('/delete', [StoryController::class, 'delete'])->name('admin.stories.delete');
        Route::post('/story/status-update', [StoryStatusController::class, 'update'])->name('admin.stories.story.status-update');
    });

    Route::prefix('/audio-recordings')->group(function () {
        Route::get('/', [AudioRecordingController::class, 'adminAllAudioRecordings'])->name('admin.audio-recordings.all');
        Route::post('/update', [AudioRecordingController::class, 'update'])->name('admin.audio-recordings.update');
        Route::post('/delete', [AudioRecordingController::class, 'delete'])->name('admin.audio-recordings.delete');
    });

    Route::prefix('/spoken-stories')->group(function () {
        Route::get('/', [SpokenStoryRecordingController::class, 'index'])->name('admin.spoken-stories.all');
        Route::post('/update', [SpokenStoryRecordingController::class, 'update'])->name('admin.spoken-stories.update');
        Route::post('/total-share', [SpokenStoryRecordingController::class, 'adminSetTotalShare'])->name('admin.spoken-stories.total-share');
        Route::post('/delete', [SpokenStoryRecordingController::class, 'delete'])->name('admin.spoken-stories.delete');
    });

    Route::prefix('/written-messages')->group(function () {
        Route::get('/', [WrittenMessageController::class, 'adminAllWrittenMessages'])->name('admin.written-messages.all');
        Route::post('/update', [WrittenMessageController::class, 'adminUpdate'])->name('admin.written-messages.update');
        Route::post('/total-share', [WrittenMessageController::class, 'adminSetTotalShare'])->name('admin.written-messages.total-share');
        Route::post('/delete', [WrittenMessageController::class, 'adminDelete'])->name('admin.written-messages.delete');
    });


   
    Route::prefix('/transactions')->group(function () {
        Route::get('/gift-transactions', [TransactionPageController::class, 'giftTransactions'])->name('admin.transactions.gift-transactions');
        Route::get('/donations', [TransactionPageController::class, 'donations'])->name('admin.transactions.donations.index');
        Route::get('/top-ups', [TransactionPageController::class, 'topUps'])->name('admin.transactions.top-ups.index');
        Route::get('/withdrawals', [TransactionPageController::class, 'withdrawals'])->name('admin.transactions.withdrawals.index');
        Route::post('/transfer-to-cause', [TransactionPageController::class, 'transferToMonthlyCause'])
            ->middleware('auth')
            ->name('admin.transfer.to.cause');
    });

    Route::get('/wallets', [TransactionPageController::class, 'wallets'])->name('admin.wallets');
    Route::post('/wallets/update-percents', [TransactionPageController::class, 'updatePercents'])->name('admin.wallets.update-percents');
    Route::post('/wallets/clear-donations', [TransactionPageController::class, 'clearDonations'])->name('wallets.clear-donations');

    Route::get('blacklisted-words', [BlacklistedWordController::class, 'index'])->name('admin.blacklisted-words.index');
    Route::post('blacklisted-words', [BlacklistedWordController::class, 'store'])->name('admin.blacklisted-words.store');
    Route::delete('blacklisted-words/{blacklistedWord}', [BlacklistedWordController::class, 'destroy'])->name('admin.blacklisted-words.destroy');

    Route::get('/connect/edit', [ConnectWithUsController::class, 'edit'])->name('admin.connect.edit');
    Route::post('/connect/update', [ConnectWithUsController::class, 'update'])->name('admin.connect.update');
});

/**
 * Auth actions
 */
Route::prefix('user-profile')->group(function () {
    Route::get('/{user_id?}', [ProfileController::class, 'index'])->name('user.profile.index');
});
Route::get('/users/autocomplete', [ProfileController::class, 'autocompleteUsers'])->name('users.autocomplete');
Route::prefix('creator-dashboard')->group(function () {
    Route::get('/', [ProfileController::class, 'creatorDashboard'])->name('user.creator.dashboard');
});
Route::prefix('my-space')->group(function () {
    Route::get('/', [ProfileController::class, 'mySpace'])->name('user.profile.myspace');
});



Route::middleware(['auth'])->post('/written-messages', [WrittenMessageController::class, 'store'])->name('written-messages.store');

// Public written story page (used by share links)
Route::get('/written-stories/{writtenMessage}', [WrittenMessageController::class, 'publicShow'])
    ->name('written-messages.public.show');

Route::post('/written-messages/share', [WrittenMessageController::class, 'share'])
    ->name('written-messages.share');

// Written message comments (view is public, create requires auth)
Route::get('/written-messages/{writtenMessage}/comments', [WrittenMessageCommentController::class, 'index'])
    ->name('written-messages.comments.index');
Route::middleware(['auth'])->post('/written-messages/{writtenMessage}/comments', [WrittenMessageCommentController::class, 'store'])
    ->name('written-messages.comments.store');


Route::prefix('recorder')->group(function () {
    Route::get('/', [AudioRecordingController::class, 'index'])->name('user.recorder');
    Route::post('/create', [AudioRecordingController::class, 'store'])->name('user.recorder.store');
});

// Spoken Stories recorder (separate from audio_recordings)
Route::middleware(['auth'])->prefix('spoken-recorder')->group(function () {
    Route::post('/create', [\App\Http\Controllers\SpokenStoryRecordingController::class, 'store'])
        ->name('spoken.recorder.store');
});

// Spoken story comments (view is public, create requires auth)
Route::get('/spoken-stories/{spokenStoryRecording}/comments', [SpokenStoryCommentController::class, 'index'])
    ->name('spoken-stories.comments.index');
Route::middleware(['auth'])->post('/spoken-stories/{spokenStoryRecording}/comments', [SpokenStoryCommentController::class, 'store'])
    ->name('spoken-stories.comments.store');

// Public spoken story page (used by share links)
Route::get('/spoken-stories/{spokenStoryRecording}', [SpokenStoryController::class, 'publicShow'])
    ->name('spoken-stories.public.show');
Route::post('/spoken-stories/share', [SpokenStoryController::class, 'share'])
    ->name('spoken-stories.share');
Route::middleware(['auth'])->prefix('my-recordings')->group(function () {
    Route::get('/', [AudioRecordingController::class, 'userRecordingsPage'])->name('user.recordings.index');
    Route::get('/more', [AudioRecordingController::class, 'userRecordingsMore'])->name('user.recordings.more');
});
 Route::prefix('/story-view')->group(function () {
    Route::post('/create', [StoryViewController::class, 'store'])->name('user.story.view.store');
});
Route::get('/draft', [HomepageController::class, 'draftPage'])->name('editor.draft.index');
Route::get('/followers/{user_id?}', [FollowController::class, 'followers'])->name('user.followers');
Route::get('/following/{user_id?}', [FollowController::class, 'following'])->name('user.following');
Route::post('story-share', [StoryController::class, 'share'])->name('story.share');
Route::get('paypal/callback', [PayPalAuthController::class, 'handlePayPalCallback']);
// Route::middleware(['auth'])->get('/manual-upload-video',[StoryController::class, 'manualUploadVideo'])->name('story.manual.upload.video');
    

Route::middleware(['auth'])->group(function () {
    Route::get('/manual-upload-video', [StoryController::class, 'manualUploadVideo'])->name('story.manual.upload.video');
    Route::get('/draft', [HomepageController::class, 'draftPage'])->name('editor.draft.index');
    
    Route::get('/trigger-video-editor', [HomepageController::class, 'triggerVideoEditor'])
    ->name('trigger.video.editor');


    Route::post('/paypal-account-remove', [PayPalAuthController::class, 'paypalAccountRemove'])->name('user.paypal.account.remove');
    Route::get('/paypal-account-verify', [PayPalAuthController::class, 'redirectToPayPal'])->name('user.paypal.account.verify');
    Route::get('/connections', [ProfileController::class, 'connections'])->name('user.profile.connections');
    Route::get('/story-video-editor', [StoryController::class, 'videoEditor'])->name('story.video.editor');
    // Route::get('/upload-manual-video', [StoryController::class, 'uploadManualVideo'])->name('story.upload.manual.video');
    
    
    Route::prefix('profile')->group(function () {

        Route::get('/edit', [ProfileController::class, 'edit'])->name('user.profile.edit');
        Route::post('/', [ProfileController::class, 'update'])->name('user.profile.update');
        Route::delete('/', [ProfileController::class, 'delete'])->name('user.profile.delete');

        Route::post('/follow-profile', [FollowController::class, 'follow'])->name('user.profile.follow');
        Route::delete('/delete-account', [UserController::class, 'destroy'])->name('profile.destroy');

    });

    Route::prefix('/stories')->group(function () {
        Route::get('/show', [StoryController::class, 'show'])->name('user.stories.show');
        Route::get('/create', [StoryController::class, 'create'])->name('user.stories.create');
        Route::post('/store', [StoryController::class, 'store'])->name('user.stories.store');
        Route::post('/store-manual', [StoryController::class, 'storeManualVideo'])->name('user.stories.manual.store');
        Route::post('/delete', [StoryController::class, 'delete'])->name('user.stories.delete');
        Route::post('/upload-media', [VideoEditorController::class, 'upload']);
        Route::post('/save-draft', [VideoEditorController::class, 'saveDraft']);
        Route::post('/like', [StoryController::class, 'like'])->name('user.stories.like');
        Route::post('/vote', [HomepageController::class, 'voting'])->name('user.stories.vote');
        Route::post('/comments', [CommentController::class, 'store'])->name('stories.comments.store');
        Route::delete('/story/{id}', [StoryController::class, 'destroy'])->name('story.destroy');
    });
    Route::prefix('/video_editor')->group(function () {
        Route::post('/store-editor-media', [StoryController::class, 'storeMedia'])->name('stories.media.store');
        Route::get('/get-editor-media', [StoryController::class, 'getMedia'])->name('stories.media.index');
        Route::get('/reset-all-media', [StoryController::class, 'resetAllMedia'])->name('stories.media.reset');
        Route::post('/delete-media', [StoryController::class, 'deleteMedia'])->name('stories.media.delete');
        Route::post('/update-media', [StoryController::class, 'updateMedia'])->name('stories.media.update');
    });

    // Draft management routes (moved from api.php for session-based auth)
    Route::prefix('/draft')->group(function () {
        Route::post('/save', [\App\Http\Controllers\DraftController::class, 'saveDraft'])->name('draft.save');
        Route::get('/load', [\App\Http\Controllers\DraftController::class, 'loadDraft'])->name('draft.load');
        Route::delete('/delete', [\App\Http\Controllers\DraftController::class, 'deleteDraft'])->name('draft.delete');
        Route::get('/has-draft', [\App\Http\Controllers\DraftController::class, 'hasDraft'])->name('draft.has');
    });
    
    // Media management routes (moved from api.php for session-based auth)
    Route::prefix('/media')->group(function () {
        Route::post('/save', [\App\Http\Controllers\DraftController::class, 'saveMedia'])->name('media.save');
        Route::get('/get', [\App\Http\Controllers\DraftController::class, 'getMedia'])->name('media.get');
        Route::get('/preview-video', [\App\Http\Controllers\DraftController::class, 'getPreviewVideo'])->name('media.preview-video');
        Route::get('/has-draft-video', [\App\Http\Controllers\DraftController::class, 'hasDraftVideo'])->name('media.has-draft-video');
        Route::delete('/clear', [\App\Http\Controllers\DraftController::class, 'clearMedia'])->name('media.clear');
        Route::delete('/delete', [\App\Http\Controllers\DraftController::class, 'deleteMedia'])->name('media.delete');
        Route::put('/update', [\App\Http\Controllers\DraftController::class, 'updateMedia'])->name('media.update');
    });

    Route::prefix('gift-transaction')->group(function () {
        Route::post('/store', [GiftTransactionController::class, 'store'])->name('user.gift-transaction.store');
        // TODO() - DELETE IT AFTER CREATING STRIPE PAYMENT
        Route::post('/balance/refill', [GiftTransactionController::class, 'refillBalance'])->name('user.gift.balance.refill');
    });

    Route::prefix('/poll')->group(function () {
        Route::get('/', [SupportController::class, 'index'])->name('user.poll.index');
        Route::post('/vote', [PollController::class, 'vote'])->name('user.poll.vote');
        Route::get('/winner', [PollController::class, 'showWinner'])->name('user.poll.winner');
    });

    Route::prefix('/generation')->group(function () {
        Route::post('/image', [ImageGenerationController::class, 'generateImage'])->name('user.generation.image');
        Route::get('/check-status/{id}', [ImageGenerationController::class, 'checkImageStatus'])->name('user.generation.check-status');
    });

    Route::get('/transactions', [TransactionPageController::class, 'index'])->name('user.transactions.index');
    Route::post('/upload', [UploadController::class, 'file'])->name('user.upload.file');
    Route::get('/users', [UserController::class, 'getAllUsers'])->name('user.users.all');
});

/**
 * Payment
 */
// Route::middleware(['auth'])->prefix('/payment')->group(function () {
//     Route::post('/top-up', [PaymentController::class, 'store'])->name('payment.top-up');
//     Route::get('/success', [PaymentController::class, 'success'])->name('payment.success');
//     Route::get('/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
// });
Route::middleware(['auth'])->group(function () {
    Route::prefix('/payment')->group(function () {
        Route::post('/top-up', [StripeController::class, 'store'])->name('payment.top-up');
        Route::get('/success', [StripeController::class, 'success'])->name('payment.success');
        Route::get('/cancel', [StripeController::class, 'cancel'])->name('payment.cancel');
    });

    // Route::prefix('/payout')->middleware(HandlePayoutRequest::class)->group(function () {
    //     Route::post('/to-stripe-account', [StripeController::class, 'payout'])->name('payout.to-stripe-account');
    // });

    Route::prefix('/payout')->group(function () {
        Route::post('/to-stripe-account', [StripeController::class, 'payout'])->name('payout.to-stripe-account')->middleware(HandlePayoutRequest::class);
        Route::post('/to-paypal-account', [PayPalController::class, 'withdraw'])->name('payout.to-paypal-account');
    });

    // Route::prefix('/payout')->middleware(HandlePayoutRequest::class)->group(function () {
    //     Route::post('/to-stripe-account', [StripeController::class, 'payout'])->name('payout.to-stripe-account');
    // });
    Route::prefix('/stripe')->group(function () {
        Route::get('/onboarding', [StripeController::class, 'redirectToOnboardingLink'])->name('stripe.onboarding');
        Route::get('/refresh', [StripeController::class, 'refresh'])->name('stripe.refresh');
    });
});

/**
 * Donation
 */
// Route::prefix('/donation')->group(function () {
//     Route::get('/', [DonatePageController::class, 'index'])->name('donation.index');
//     Route::post('/donate', [DonationController::class, 'store'])->name('donation.donate');
//     Route::get('/success', [DonationController::class, 'success'])->name('donation.success');
//     Route::get('/cancel', [DonationController::class, 'cancel'])->name('donation.cancel');
// });

/**
 * Public
 */
Route::get('/highlight-stories/{story_id}/{type?}', [StoryController::class, 'allHighlightStories'])->name('stories.highlight');
Route::prefix('/all-stories')->group(function () {
    Route::get('/', [StoryController::class, 'allStories'])->name('stories.allStories');
    Route::get('/{id?}', [StoryController::class, 'allStories'])->name('stories.allStories.single');
    Route::get('/load-more-stories/{category}', [StoryController::class, 'loadMoreStories'])->name('stories.loadMore');
    Route::get('/all-comments/{story_id}', [StoryController::class, 'getAllCommentsInStory'])->name('stories.allcomments');
});

Route::prefix('/connect-with-us')->group(function () {
    Route::get('/', [ConnectWithUsController::class, 'index'])->name('connect-with-us.index');
    Route::post('/', [ConnectWithUsController::class, 'store'])->name('connect-with-us.store');
});

Route::get('/', [HomepageController::class, 'index'])->name('home');
Route::get('/about', [AboutPageController::class, 'index'])->name('about-page.index');
Route::get('/create-showdown', [HomepageController::class, 'competition'])->name('competition-page.index');
// Temporarily disabled
// Route::get('/editor-new-contest', [HomepageController::class, 'editorNewContest'])->name('competition-new-page.index');
Route::get('/editor-contest', [HomepageController::class, 'editorContest'])->name('editor-contest.index');
Route::get('/editor-contest/load-more-stories', [HomepageController::class, 'editorContestLoadMore'])->name('editor-contest.loadmore.index');
Route::get('/share-information', [HomepageController::class, 'shareInformation'])->name('share.info.index');
Route::get('/how-to-create-a-story', [HomepageController::class, 'howToCreateAStory'])->name('how.to.create.a.story');
Route::get('/page/{page}', [StaticPageController::class, 'show'])->name('static.page');
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])->name('stripe.webhook.handle');

/**
 * Mailchimp Auto-Login Route (Independent - doesn't affect existing features)
 * URL format: /create-story?token={encrypted_email}&iv={iv}
 * This route is only used for Mailchimp email campaign links
 */
Route::get('/create-story', [\App\Http\Controllers\AutoLoginController::class, 'createStory'])->name('create-story.auto-login');

/**
 * Magic link: log in by email token and redirect to draft page
 * URL format: /draft-login?token={encrypted_email}&iv={iv}
 */
Route::get('/draft-login', [\App\Http\Controllers\AutoLoginController::class, 'draftPage'])->name('draft.auto-login');

/**
 * Magic link: log in by email token and redirect to manual-upload-video
 * URL format: /manual-upload-video-login?token={encrypted_email}&iv={iv}
 */
Route::get('/manual-upload-video-login', [\App\Http\Controllers\AutoLoginController::class, 'manualUploadVideo'])->name('manual-upload-video.auto-login');

Route::post('/visitor-duration', [VisitorController::class, 'storeDuration'])
    ->withoutMiddleware(VerifyCsrfToken::class)
    ->name('visitor.duration.store');

require __DIR__ . '/auth.php';
