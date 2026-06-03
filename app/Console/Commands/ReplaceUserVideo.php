<?php

namespace App\Console\Commands;

use App\Models\Story;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReplaceUserVideo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'story:replace-video 
                            {--user-id= : User ID}
                            {--email= : User email}
                            {--video-path= : Path to the new video file on local system}
                            {--delete-old : Delete old video file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Replace a user\'s video file with a new one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->option('user-id');
        $email = $this->option('email');
        $videoPath = $this->option('video-path');
        $deleteOld = $this->option('delete-old');

        // Validate inputs
        if (!$userId && !$email) {
            $this->error('Please provide either --user-id or --email');
            return 1;
        }

        if (!$videoPath) {
            $this->error('Please provide --video-path to the new video file');
            return 1;
        }

        if (!file_exists($videoPath)) {
            $this->error("Video file not found at: {$videoPath}");
            return 1;
        }

        // Find user
        $user = null;
        if ($userId) {
            $user = User::find($userId);
        } elseif ($email) {
            $user = User::where('email', $email)->first();
        }

        if (!$user) {
            $this->error('User not found');
            return 1;
        }

        $this->info("Found user: {$user->name} ({$user->email}) - ID: {$user->id}");

        // Find user's story
        $story = Story::where('user_id', $user->id)->first();

        if (!$story) {
            $this->error('No story found for this user');
            return 1;
        }

        $this->info("Found story ID: {$story->id}");
        $this->info("Current video: {$story->src}");

        // Get old video path for potential deletion
        // Extract filename from old src (could be full URL or just filename)
        $oldVideoFilename = null;
        if ($story->src) {
            // If src is a full URL, extract filename; otherwise use as-is
            if (strpos($story->src, 'http') === 0 || strpos($story->src, 'https') === 0) {
                // Full URL - extract filename
                $oldVideoFilename = basename(parse_url($story->src, PHP_URL_PATH));
            } else {
                // Just filename
                $oldVideoFilename = $story->src;
            }
            $oldVideoPath = $oldVideoFilename ? "videos/{$oldVideoFilename}" : null;
        } else {
            $oldVideoPath = null;
        }

        // Generate new unique filename
        $extension = pathinfo($videoPath, PATHINFO_EXTENSION);
        $newFilename = Str::uuid()->toString() . '.' . $extension;

        $this->info("New filename will be: {$newFilename}");

        // Upload new video
        try {
            $this->info('Uploading new video...');
            
            // Read the file content
            $fileContent = file_get_contents($videoPath);
            
            // Determine storage disk - Check if S3 is configured
            $useS3 = env('AWS_BUCKET') && env('AWS_ACCESS_KEY_ID') && env('AWS_SECRET_ACCESS_KEY');
            $disk = $useS3 ? 's3' : 'public';

            if ($useS3) {
                $this->info('Using S3 storage');
            } else {
                $this->info('Using local storage');
            }

            // Store the new video
            Storage::disk($disk)->put("videos/{$newFilename}", $fileContent);

            $this->info("✓ Video uploaded successfully");

            // Get the full URL (S3 URL or local URL)
            if ($useS3) {
                // For S3, construct the proper URL
                $bucket = env('AWS_BUCKET');
                $region = env('AWS_DEFAULT_REGION', 'us-east-1');
                $awsUrl = env('AWS_URL');
                
                if ($awsUrl) {
                    // Use custom AWS_URL if configured
                    $fullVideoUrl = rtrim($awsUrl, '/') . '/videos/' . $newFilename;
                } else {
                    // Construct standard S3 URL
                    $fullVideoUrl = "https://{$bucket}.s3.{$region}.amazonaws.com/videos/{$newFilename}";
                }
                
                $this->info("Generated S3 URL: {$fullVideoUrl}");
            } else {
                // Local storage URL
                $fullVideoUrl = Storage::disk('public')->url("videos/{$newFilename}");
                $this->info("Using local URL: {$fullVideoUrl}");
            }

            // Update story record with full URL (not just filename)
            $story->src = $fullVideoUrl;
            $story->save();

            $this->info("✓ Story record updated");

            // Delete old video if requested
            if ($deleteOld && $oldVideoPath) {
                try {
                    if (Storage::disk($disk)->exists($oldVideoPath)) {
                        Storage::disk($disk)->delete($oldVideoPath);
                        $this->info("✓ Old video deleted");
                    } else {
                        $this->warn("Old video file not found, may have been already deleted");
                    }
                } catch (\Exception $e) {
                    $this->warn("Could not delete old video: " . $e->getMessage());
                }
            }

            $this->newLine();
            $this->info('✓ Success! Video replaced successfully');
            $this->info("New video URL: " . Storage::disk($disk)->url("videos/{$newFilename}"));

            return 0;

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }
}
