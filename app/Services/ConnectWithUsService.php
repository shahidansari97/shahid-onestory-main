<?php

namespace App\Services;

use App\Contracts\Services\ConnectWithUsServiceInterface;
use App\Models\ConnectPage;
use Illuminate\Support\Facades\Mail;

class ConnectWithUsService implements ConnectWithUsServiceInterface
{
    public function getStructuredContent(): array
    {
        $content = ConnectPage::all()->pluck('value', 'key');
        return [
            'mainContent'  => json_decode($content['mainContent'] ?? '{}', true),
            'socialMedia'  => json_decode($content['socialMedia'] ?? '{}', true),
            'emailSettings'=> json_decode($content['emailSettings'] ?? '{}', true),
            'categories'   => json_decode($content['categories'] ?? '[]', true),
        ];
    }

    public function getRecipientEmail(): string
    {
        $emailSettings = ConnectPage::where('key', 'emailSettings')->value('value');
        $decoded = $emailSettings ? json_decode($emailSettings) : null;
        return $decoded->recipientEmail ?? config('mail.from.address');
    }

    public function updateContent(array $validated): void
    {
        $this->updateOrCreateContent('mainContent', $validated['mainContent'] ?? []);

        if (!empty($validated['socialMedia'])) {
            $this->updateOrCreateContent('socialMedia', $validated['socialMedia']);
        }

        if (!empty($validated['emailSettings'])) {
            $this->updateOrCreateContent('emailSettings', $validated['emailSettings']);
        }

        if (!empty($validated['categories'])) {
            $this->updateOrCreateContent('categories', $validated['categories']);
        } else {
            ConnectPage::where('key', 'categories')->delete();
        }
    }

    private function updateOrCreateContent(string $key, array $data): void
    {
        ConnectPage::updateOrCreate(
            ['key' => $key],
            ['value' => json_encode($data)]
        );
    }
}
