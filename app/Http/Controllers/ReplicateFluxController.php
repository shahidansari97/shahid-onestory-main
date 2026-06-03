<?php

namespace App\Http\Controllers;

use App\Contracts\Services\ReplicateFluxServiceInterface;
use Illuminate\Http\Request;

class ReplicateFluxController extends Controller
{
    private ReplicateFluxServiceInterface $replicateFluxService;

    public function __construct(ReplicateFluxServiceInterface $replicateFluxService)
    {
        $this->replicateFluxService = $replicateFluxService;
    }

    public function index()
    {
        return $this->replicateFluxService->listOfPredictions();
    }

    public function show(Request $request)
    {
        return $this->replicateFluxService->getPrediction($request->id);
    }

    public function store(Request $request)
    {
        return $this->replicateFluxService->createPrediction($request->prompt);
    }

    public function delete(Request $request)
    {
        return $this->replicateFluxService->cancelPrediction($request->id);
    }
}
