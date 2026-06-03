<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateMailchimpLinksFromCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailchimp:generate-links-from-csv 
                            {csv-file : Path to the Mailchimp CSV file}
                            {--output= : Output file path (default: same as input with _with_links suffix)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Mailchimp auto-login links for emails in a CSV file and add them as a new column';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $csvFile = $this->argument('csv-file');
        
        if (!file_exists($csvFile)) {
            $this->error("CSV file not found: {$csvFile}");
            return Command::FAILURE;
        }
        
        $this->info("Reading CSV file: {$csvFile}");
        
        // Read CSV file
        $rows = [];
        $headers = [];
        $emailColumnIndex = null;
        
        if (($handle = fopen($csvFile, 'r')) !== false) {
            $rowIndex = 0;
            while (($data = fgetcsv($handle)) !== false) {
                if ($rowIndex === 0) {
                    // First row is headers
                    $headers = $data;
                    // Find email column
                    foreach ($headers as $index => $header) {
                        if (stripos($header, 'email') !== false) {
                            $emailColumnIndex = $index;
                            break;
                        }
                    }
                    
                    if ($emailColumnIndex === null) {
                        $this->error("Email column not found in CSV. Please ensure there's a column with 'email' in the name.");
                        fclose($handle);
                        return Command::FAILURE;
                    }
                    
                    $this->info("Found email column at index: {$emailColumnIndex} ({$headers[$emailColumnIndex]})");
                    $rows[] = $data; // Add headers to rows
                } else {
                    $rows[] = $data;
                }
                $rowIndex++;
            }
            fclose($handle);
        }
        
        $totalRows = count($rows) - 1; // Exclude header
        $this->info("Found {$totalRows} email addresses to process.");
        
        // Encryption key (must match AutoLoginController)
        $encryptionKey = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ];
        $key = pack('C*', ...$encryptionKey);
        
        // Base URL for links (production)
        $baseUrl = 'https://onestoryplanet.com';
        
        // Add "Create Story Link" column to headers
        $headers[] = 'Create Story Link';
        
        // Generate links for each row
        $bar = $this->output->createProgressBar($totalRows);
        $bar->start();
        
        $processedRows = [$headers]; // Start with updated headers
        
        for ($i = 1; $i < count($rows); $i++) {
            $row = $rows[$i];
            $email = isset($row[$emailColumnIndex]) ? trim($row[$emailColumnIndex]) : '';
            
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                // Invalid email, add empty link
                $row[] = '';
                $processedRows[] = $row;
                $bar->advance();
                continue;
            }
            
            try {
                // Generate random IV (16 bytes for AES-256-CBC)
                $iv = random_bytes(16);
                
                // Encrypt email using AES-256-CBC
                $encrypted = openssl_encrypt($email, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
                
                // Encode to base64 for URL transmission
                $encryptedBase64 = base64_encode($encrypted);
                $ivBase64 = base64_encode($iv);
                
                // Generate full URL
                $link = $baseUrl . '/create-story?token=' . urlencode($encryptedBase64) . '&iv=' . urlencode($ivBase64);
                
                // Add link to row
                $row[] = $link;
            } catch (\Exception $e) {
                $this->newLine();
                $this->warn("Failed to generate link for {$email}: {$e->getMessage()}");
                $row[] = ''; // Add empty link on error
            }
            
            $processedRows[] = $row;
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine(2);
        
        // Determine output file path
        $outputPath = $this->option('output');
        if (!$outputPath) {
            $pathInfo = pathinfo($csvFile);
            $outputPath = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_with_links.' . $pathInfo['extension'];
        }
        
        // Write updated CSV
        $this->info("Writing updated CSV to: {$outputPath}");
        
        if (($handle = fopen($outputPath, 'w')) !== false) {
            foreach ($processedRows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }
        
        $this->newLine();
        $this->info("✅ Successfully generated links for {$totalRows} emails!");
        $this->info("📁 Updated file saved to: {$outputPath}");
        $this->newLine();
        $this->info("💡 The 'Create Story Link' column has been added to your CSV.");
        $this->info("   You can now use this column in Mailchimp as a merge field.");
        
        return Command::SUCCESS;
    }
}

