<?php

namespace App\Helpers;

use Illuminate\Support\Arr;
/**
 * Returns value column from SiteSettings
 *
 * @returns array
 */
if (!function_exists('getValueFromSiteSettings')) {
    function getValueFromSiteSettings(array $array): array
    {
        $keys = ['header', 'footer', 'common'];

        return Arr::only(
            Arr::pluck($array, 'value', 'key'),
            $keys
        );
    }
}

/**
 * Returns value column from Homepage
 *
 * @returns array
 */
if (!function_exists('getValueFromHomepage')) {
    function getValueFromHomepage(array $array): array
    {
        $keys = ['hero', 'storyBlock', 'aboutBlock'];

        return Arr::only(
            Arr::pluck($array, 'value', 'key'),
            $keys
        );
    }
}

/**
 * Generate Mailchimp email campaign link for auto-login to create story
 * 
 * This is an independent feature that doesn't affect existing functionality.
 * Used only for Mailchimp email campaigns.
 * 
 * @param string $email User's email address
 * @return string Full URL with encrypted token for auto-login
 */
if (!function_exists('generateMailchimpCreateStoryLink')) {
    function generateMailchimpCreateStoryLink(string $email): string
    {
        // Encryption key (must match frontend and AutoLoginController)
        $encryptionKey = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ];
        
        // Convert key array to binary string
        $key = pack('C*', ...$encryptionKey);
        
        // Generate random IV (16 bytes for AES-256-CBC)
        $iv = random_bytes(16);
        
        // Encrypt email using AES-256-CBC
        $encrypted = openssl_encrypt($email, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
        
        // Encode to base64 for URL transmission
        $encryptedBase64 = base64_encode($encrypted);
        $ivBase64 = base64_encode($iv);
        
        // Generate full URL
        $baseUrl = config('app.url', env('APP_URL', 'https://onestoryplanet.com'));
        $link = $baseUrl . '/create-story?token=' . urlencode($encryptedBase64) . '&iv=' . urlencode($ivBase64);
        
        return $link;
    }
}



if (!function_exists('smtpCheck')) {
    function smtpCheck($email) {

        // Extract domain
        $domain = substr(strrchr($email, "@"), 1);

        // Check MX record
        if (!checkdnsrr($domain, "MX")) {
            return false;
        }

        // Get MX hosts
        $mxhosts = [];
        getmxrr($domain, $mxhosts);

        // Connect to SMTP server
        $connect = @fsockopen($mxhosts[0], 25, $errno, $errstr, 10);

        if (!$connect) {
            return false;
        }

        // Send SMTP commands
        fwrite($connect, "HELO example.com\r\n");

        fwrite($connect, "MAIL FROM:<test@example.com>\r\n");

        fwrite($connect, "RCPT TO:<$email>\r\n");

        // Read response
        $response = fgets($connect, 1024);

        fclose($connect);

        // Final result
        $result = strpos($response, '250') !== false;

        return $result;
    }
}