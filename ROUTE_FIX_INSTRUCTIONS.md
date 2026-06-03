# Fix for Route Redirect Issue

## Problem
When accessing `/admin/stories/replace-video`, it redirects to the all stories page instead of showing the upload form.

## Solution
The route order has been fixed. You need to:

### Step 1: Clear Route Cache
On your **live server**, run:
```bash
php artisan route:clear
```

### Step 2: Verify Route Order
Make sure in `routes/web.php`, the routes are in this order:
```php
Route::prefix('/stories')->group(function () {
    Route::get('/', [StoryController::class, 'adminAllStories'])->name('admin.stories.all');
    Route::get('/replace-video', [\App\Http\Controllers\Admin\ReplaceVideoController::class, 'index'])->name('admin.stories.replace-video');
    Route::post('/replace-video', [\App\Http\Controllers\Admin\ReplaceVideoController::class, 'replace'])->name('admin.stories.replace-video');
    Route::get('/{id}', [StoryController::class, 'show'])->name('admin.stories.show');
    // ... other routes
});
```

**Important:** The `/replace-video` routes MUST come BEFORE the `/{id}` route, otherwise Laravel will match "replace-video" as an ID parameter.

### Step 3: Clear All Caches (if needed)
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Step 4: Test
Visit: `https://your-domain.com/admin/stories/replace-video`

You should now see the upload form instead of being redirected.

## Why This Happens
Laravel matches routes in the order they are defined. When `/admin/stories/{id}` comes before `/admin/stories/replace-video`, Laravel treats "replace-video" as an ID and tries to find a story with that ID, which doesn't exist, so it redirects.

## Alternative: Use a Different URL
If you still have issues, you can change the route to:
```php
Route::get('/replace-video', ...)  // Change to something like:
Route::get('/video/replace', ...)  // This avoids conflict
```
