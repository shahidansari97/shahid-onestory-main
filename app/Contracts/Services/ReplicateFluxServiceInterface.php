<?php

namespace App\Contracts\Services;

interface ReplicateFluxServiceInterface
{
    /**
     * @param string $prompt
     * @return array
     */
    public function createPrediction(string $prompt): array;

    /**
     * @param int $id
     * @return array
     */
    public function getPrediction(int $id): array;

    /**
     * @return array
     */
    public function listOfPredictions(): array;

    /**
     * @param int $id
     * @return array
     */
    public function cancelPrediction(int $id): array;
}
