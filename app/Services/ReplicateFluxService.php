<?php

namespace App\Services;

use App\Contracts\Services\ReplicateFluxServiceInterface;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class ReplicateFluxService implements ReplicateFluxServiceInterface
{
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.flux_ai.base_url');
        $this->apiKey = config('services.flux_ai.api_key');
    }

    /**
     * @throws ConnectionException
     */
    public function createPrediction(string $prompt): array
    {
        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->baseUrl, [
            'input' => [
                'prompt' => $prompt
            ],
        ])->json();
    }

    /**
     * @throws ConnectionException
     */
    public function getPrediction(int $id): array
    {
        $url = $this->baseUrl . '/' . $id;

        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->get($url)->json();
    }

    /**
     * @throws ConnectionException
     */
    public function listOfPredictions(): array
    {
        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->get($this->baseUrl)->json();
    }

    /**
     * @throws ConnectionException
     */
    public function cancelPrediction(int $id): array
    {
        $url = $this->baseUrl . '/' . $id;

        return Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($url)->json();
    }
}
