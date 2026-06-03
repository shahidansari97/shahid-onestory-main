<?php

use App\Jobs\ProcessAnalyticsEventsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    $job = app(ProcessAnalyticsEventsJob::class);
    $job->handle(
        app(\App\Analytics\AnalyticsEventBuffer::class),
        app(\App\Analytics\VisitTrackingProcessor::class),
    );
})
    ->name('analytics:process-events')
    ->everyTenSeconds()
    ->withoutOverlapping(30)
    ->when(fn () => config('analytics.enabled', true));
