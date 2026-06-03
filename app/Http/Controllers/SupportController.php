<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PollServiceInterface;
use App\Contracts\Services\SupportServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    private SupportServiceInterface $supportService;
    private $votingService;
    private array $supportData;

    public function __construct(SupportServiceInterface $supportService, PollServiceInterface $votingService)
    {
        $this->supportService = $supportService;
        $this->supportData = $this->supportService->getSupportData();
        $this->votingService = $votingService;
    }

    public function index()
    {
        $question = $this->votingService->getActualActiveQuestion();
        $hasVoted = $question ? $this->votingService->hasUserVoted($question->id, auth()->id()) : false;

        return Inertia::render('Voting/Poll', [
            'question' => $question,
            'variants' => $question ? $this->votingService->getVariantsForQuestion($question->id) : [],
            'hasVoted' => $hasVoted,
            'data' => $this->supportData['content'],
        ]);
    }

    public function edit()
    {
        return Inertia::render('Dashboard/PollPage/Edit', [
            'data' => $this->supportData['content'],
        ]);
    }

    public function update(Request $request)
    {
//        $request->validate([
//            'title' => 'nullable|string',
//            'subtitle' => 'nullable|string',
//            'description' => 'nullable|string',
//            'prescription' => 'nullable|string',
//            'images.*' => 'nullable|file|mimes:jpg,jpeg,png',
//        ]);

        $this->supportService->updateSupportPage(
            content: [
                'title' => $request->input('title'),
                'subtitle' => $request->input('subtitle'),
                'description' => $request->input('description'),
                'prescription' => $request->input('prescription'),
                'amount' => $request->input('amount'),
            ],
            images: $request->file('images')
        );

        return redirect()->route('admin.support.edit')->with('message', 'Data saved successfully');
    }

    public function deleteImage(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:support_images,id',
        ]);

        $result = $this->supportService->deleteImage($request->id);

        return response()->json($result);
    }
}
