<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateMailchimpLinks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:generate-links 
                            {--export=csv : Export format (csv or json)}
                            {--output= : Output file path (default: storage/app/mailchimp_links.csv)}
                            {--base-url= : Base URL for links (default: from config)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Mailchimp auto-login links for all users and export to CSV/JSON';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating Mailchimp links for all users...');
        
        // Get all users
        $users = User::select('id', 'email', 'name')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();
        
        if ($users->isEmpty()) {
            $this->error('No users found with email addresses.');
            return Command::FAILURE;
        }
        
        $this->info("Found {$users->count()} users with email addresses.");
        
        // Generate links
        $links = [];
        $bar = $this->output->createProgressBar($users->count());
        $bar->start();
        
        // Encryption key (must match AutoLoginController and helper function)
        $encryptionKey = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ];
        $key = pack('C*', ...$encryptionKey);
        
        // Base URL for links (default to production for Mailchimp)
        $baseUrl = $this->option('base-url') ?? 'https://onestoryplanet.com';
        
        foreach ($users as $user) {
            try {
                // Generate random IV (16 bytes for AES-256-CBC)
                $iv = random_bytes(16);
                
                // Encrypt email using AES-256-CBC
                $encrypted = openssl_encrypt($user->email, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
                
                // Encode to base64 for URL transmission
                $encryptedBase64 = base64_encode($encrypted);
                $ivBase64 = base64_encode($iv);
                
                // Generate full URL
                $link = $baseUrl . '/create-story?token=' . urlencode($encryptedBase64) . '&iv=' . urlencode($ivBase64);
                
                $links[] = [
                    'email' => $user->email,
                    'name' => $user->name ?? '',
                    'user_id' => $user->id,
                    'create_story_link' => $link,
                ];
            } catch (\Exception $e) {
                $this->newLine();
                $this->warn("Failed to generate link for {$user->email}: {$e->getMessage()}");
            }
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);
        
        if (empty($links)) {
            $this->error('No links were generated.');
            return Command::FAILURE;
        }
        
        // Determine export format
        $exportFormat = $this->option('export');
        $outputPath = $this->option('output') ?? 
            ($exportFormat === 'json' ? 'mailchimp_links.json' : 'mailchimp_links.csv');
        
        // Ensure output path is in storage/app if relative
        if (!str_starts_with($outputPath, '/') && !str_starts_with($outputPath, storage_path())) {
            $outputPath = 'app/' . ltrim($outputPath, 'app/');
        }
        
        // Export based on format
        if ($exportFormat === 'json') {
            $this->exportJson($links, $outputPath);
        } else {
            $this->exportCsv($links, $outputPath);
        }
        
        $this->newLine();
        $this->info("✅ Successfully generated " . count($links) . " links!");
        $this->info("📁 File saved to: " . storage_path($outputPath));
        $this->newLine();
        $this->info("📋 CSV Format:");
        $this->info("   - Column 1: Email");
        $this->info("   - Column 2: Name");
        $this->info("   - Column 3: User ID");
        $this->info("   - Column 4: Create Story Link");
        $this->newLine();
        $this->info("💡 To use in Mailchimp:");
        $this->info("   1. Import the CSV file to Mailchimp");
        $this->info("   2. Map 'create_story_link' as a merge field (e.g., CREATE_STORY_LINK)");
        $this->info("   3. Use *|CREATE_STORY_LINK|* in your email template button");
        
        return Command::SUCCESS;
    }
    
    /**
     * Export links to CSV format
     */
    private function exportCsv(array $links, string $outputPath): void
    {
        $fullPath = storage_path($outputPath);
        $directory = dirname($fullPath);
        
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
        
        $file = fopen($fullPath, 'w');
        
        // Write CSV header
        fputcsv($file, ['Email', 'Name', 'User ID', 'Create Story Link']);
        
        // Write data rows
        foreach ($links as $link) {
            fputcsv($file, [
                $link['email'],
                $link['name'],
                $link['user_id'],
                $link['create_story_link'],
            ]);
        }
        
        fclose($file);
    }
    
    /**
     * Export links to JSON format
     */
    private function exportJson(array $links, string $outputPath): void
    {
        $fullPath = storage_path($outputPath);
        $directory = dirname($fullPath);
        
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
        
        file_put_contents($fullPath, json_encode($links, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}
