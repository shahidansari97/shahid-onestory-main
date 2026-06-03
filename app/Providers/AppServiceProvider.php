<?php

namespace App\Providers;

use App\Contracts\Services\AboutPageServiceInterface;
use App\Contracts\Services\AdminUsersDashboardServiceInterface;
use App\Contracts\Services\AudioRecordingServiceInterface;
use App\Contracts\Services\CameraEventServiceInterface;
use App\Contracts\Services\ConnectWithUsServiceInterface;
use App\Contracts\Services\CreatorGuidelinesServiceInterface;
use App\Contracts\Services\DashboardServiceInterface;
use App\Contracts\Services\DonatePageServiceInterface;
use App\Contracts\Services\DonationPopupServiceInterface;
use App\Contracts\Services\DonationServiceInterface;
use App\Contracts\Services\VariantServiceInterface;
use App\Contracts\Services\VideoEditorServiceInterface;
use App\Contracts\Services\GiftTransactionServiceInterface;
use App\Contracts\Services\HomepageServiceInterface;
use App\Contracts\Services\StripeServiceInterface;
use App\Contracts\Services\PollPopupServiceInterface;
use App\Contracts\Services\PollServiceInterface;
use App\Contracts\Services\PrivacyPolicyServiceInterface;
use App\Contracts\Services\ProfileServiceInterface;
use App\Contracts\Services\ReplicateFluxServiceInterface;
use App\Contracts\Services\SiteSettingsServiceInterface;
use App\Contracts\Services\SocialServiceInterface;
use App\Contracts\Services\StoryServiceInterface;
use App\Contracts\Services\SupportServiceInterface;
use App\Contracts\Services\TermsOfUseServiceInterface;
use App\Contracts\Services\TransactionPageServiceInterface;
use App\Contracts\Services\TwoFactorVerificationServiceInterface;
use App\Contracts\Services\FollowServiceInterface;
use App\Contracts\Services\CommentServiceInterface;
use App\Contracts\Services\PayPalAuthServiceInterface;
use App\Contracts\Services\PayPalServiceInterface;
use App\Contracts\Services\UserLoginLogServiceInterface;
use App\Contracts\Services\AdminNotificationInterface;
use App\Services\AboutPageService;
use App\Services\AdminUsersDashboardService;
use App\Services\AudioRecordingService;
use App\Services\CameraEventService;
use App\Services\ConnectWithUsService;
use App\Services\CreatorGuidelinesService;
use App\Services\DashboardService;
use App\Services\DonatePageService;
use App\Services\DonationPopupService;
use App\Services\DonationService;
use App\Services\VariantService;
use App\Services\VideoEditorService;
use App\Services\GiftTransactionService;
use App\Services\HomepageService;
use App\Services\StripeService;
use App\Services\PollPopupService;
use App\Services\PollService;
use App\Services\PrivacyPolicyService;
use App\Services\ProfileService;
use App\Services\ReplicateFluxService;
use App\Services\SiteSettingsService;
use App\Services\SocialService;
use App\Services\StoryService;
use App\Services\SupportService;
use App\Services\TermsOfUseService;
use App\Services\TransactionPageService;
use App\Services\TwoFactorVerificationService;
use App\Services\FollowService;
use App\Services\CommentService;
use App\Services\PayPalService;
use App\Services\PayPalAuthService;
use App\Services\UserLoginLogService;
use App\Services\AdminNotificationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\SiteSettings;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(HomepageServiceInterface::class, HomepageService::class);
        $this->app->bind(SiteSettingsServiceInterface::class, SiteSettingsService::class);
        $this->app->bind(StoryServiceInterface::class, StoryService::class);
        $this->app->bind(SocialServiceInterface::class, SocialService::class);
        $this->app->bind(ProfileServiceInterface::class, ProfileService::class);
        $this->app->bind(AdminUsersDashboardServiceInterface::class, AdminUsersDashboardService::class);
        $this->app->bind(ReplicateFluxServiceInterface::class, ReplicateFluxService::class);
        $this->app->bind(PollServiceInterface::class, PollService::class);
        $this->app->bind(GiftTransactionServiceInterface::class, GiftTransactionService::class);
        $this->app->bind(StripeServiceInterface::class, StripeService::class);
        $this->app->bind(SupportServiceInterface::class, SupportService::class);
        $this->app->bind(DonationServiceInterface::class, DonationService::class);
        $this->app->bind(DonatePageServiceInterface::class, DonatePageService::class);
        $this->app->bind(AboutPageServiceInterface::class, AboutPageService::class);
        $this->app->bind(TransactionPageServiceInterface::class, TransactionPageService::class);
        $this->app->bind(PrivacyPolicyServiceInterface::class, PrivacyPolicyService::class);
        $this->app->bind(TermsOfUseServiceInterface::class, TermsOfUseService::class);
        $this->app->bind(CreatorGuidelinesServiceInterface::class, CreatorGuidelinesService::class);
        $this->app->bind(DonationPopupServiceInterface::class, DonationPopupService::class);
        $this->app->bind(PollPopupServiceInterface::class, PollPopupService::class);
        $this->app->bind(TwoFactorVerificationServiceInterface::class, TwoFactorVerificationService::class);
        $this->app->bind(VideoEditorServiceInterface::class, VideoEditorService::class);
        $this->app->bind(VariantServiceInterface::class, VariantService::class);
        $this->app->bind(ConnectWithUsServiceInterface::class, ConnectWithUsService::class);
        $this->app->bind(DashboardServiceInterface::class, DashboardService::class);
        $this->app->bind(FollowServiceInterface::class, FollowService::class);
        $this->app->bind(CommentServiceInterface::class, CommentService::class);
        $this->app->bind(PayPalServiceInterface::class, PayPalService::class);
        $this->app->bind(PayPalAuthServiceInterface::class, PayPalAuthService::class);
        $this->app->bind(AudioRecordingServiceInterface::class, AudioRecordingService::class);
        $this->app->bind(UserLoginLogServiceInterface::class, UserLoginLogService::class);
        $this->app->bind(CameraEventServiceInterface::class, CameraEventService::class);
        $this->app->bind(AdminNotificationInterface::class, AdminNotificationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        if (DB::getDriverName() !== 'sqlite') {
            // This statement is only meant to tweak MySQL strict mode.
            // If DB is temporarily unreachable, failing here prevents *all* requests
            // (including OAuth callbacks) from being handled.
            try {
                DB::statement("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");
            } catch (\Throwable $e) {
            }
        }

        View::composer('*', function ($view) {
            $siteSettings = SiteSettings::first();

            $view->with('siteSettings', $siteSettings);
        });
    }
}
