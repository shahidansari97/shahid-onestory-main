<?php

namespace App\Services;

use App\Contracts\Services\SocialServiceInterface;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\EditorProject;

class SocialService implements SocialServiceInterface
{
    public function getOrCreateUser($socialUser, $driver): array
    {
        $email = $socialUser->getEmail();
        $socialId = $socialUser->getId();

        // Some OAuth flows (or misconfigurations) can result in missing fields like email.
        // Avoid fatal TypeErrors that would otherwise bubble up as HTTP 500.
        if (empty($email)) {
            if (empty($socialId)) {
                throw new \RuntimeException('Social login did not return email or id.');
            }
            $email = (string) $socialId . '@' . (string) $driver . '.oauth';
        }

        $email = (string) $email;
        $baseUsername = Str::slug(explode('@', $email)[0] ?: 'user') ?: 'user';

        $uniqueSuffix = substr(md5($email), 0, 6);
        $username = "{$baseUsername}-{$uniqueSuffix}";
        $existingUser = User::where('email', $email)->first();
        
        if ($existingUser) {
            // User already exists, just update the social ID if needed
            $user = $existingUser;
            if (!$user->{$driver . '_id'}) {
                $user->{$driver . '_id'} = $socialId;
                $user->save();
            }
            $isNewUser = false;
        } else {
            $user = $this->createSocialUser(
                email: $email,
                driver: $driver,
                socialId: $socialId,
                username: $username,
                name: $socialUser->getName() ?: $username,
            );
            $isNewUser = true;
        }
        // $user = User::firstOrCreate([
        //     'email' => $socialUser->getEmail(),
        // ], [
        //     'username' => $username,
        //     'name' => $socialUser->getName(),
        //     'email' => $socialUser->getEmail(),
        //     $driver . '_id' => $socialUser->getId(),
        // ]);
        //  $isNewUser = $user->wasRecentlyCreated;
        $this->ensureEditorProjectExists($user->id);

        Auth::login($user, remember: true);

        return ['user' => $user, 'isNewUser' => $isNewUser];
    }

    private function createSocialUser(
        string $email,
        string $driver,
        string $socialId,
        string $username,
        string $name,
    ): User {
        $attemptUsername = $username;

        for ($attempt = 0; $attempt < 5; $attempt++) {
            try {
                return User::create([
                    'username' => $attemptUsername,
                    'name' => $name,
                    'email' => $email,
                    $driver . '_id' => $socialId,
                ]);
            } catch (QueryException $e) {
                if ($attempt === 4 || !$this->isDuplicateKeyException($e)) {
                    throw $e;
                }

                $attemptUsername = $username . '-' . Str::lower(Str::random(4));
            }
        }

        throw new \RuntimeException('Unable to create social user account.');
    }

    private function isDuplicateKeyException(QueryException $e): bool
    {
        $errorCode = (int) ($e->errorInfo[1] ?? 0);

        return $errorCode === 1062 || str_contains(strtolower($e->getMessage()), 'duplicate');
    }

    private function ensureEditorProjectExists(int $userId): void
    {
        try {
            $checkProjectExists = EditorProject::where('userId', $userId)->first();
            if (!$checkProjectExists) {
                EditorProject::create([
                    'name' => 'Project-' . time(),
                    'lastModified' => time(),
                    'userId' => $userId,
                    'createdAt' => time(),
                    'description' => 'Project Description',
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Editor project creation failed during social login', [
                'user_id' => $userId,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
