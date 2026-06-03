<?php

namespace App\Http\Controllers;

use App\Services\VotingServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VotingController extends Controller
{
    private VotingServiceInterface $votingService;

    public function __construct(VotingServiceInterface $votingService)
    {
        $this->votingService = $votingService;
    }

    public function create()
    {
        return Inertia::render('Dashboard/CreatePoll');
    }
    public function index()
    {
        $polls = $this->votingService->getAllPolls();

        return Inertia::render('Dashboard/PollList', [
            'polls' => $polls,
        ]);
    }

    public function vote(Request $request)
    {
        $data = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'variant_id' => 'required|exists:variants,id',
        ]);

        $result = $this->votingService->vote(
            question_id: $data['question_id'],
            variant_id: $data['variant_id']
        );

        if (isset($result['error'])) {
            return response()->json([
                'success' => false,
                'error' => $result['error']
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you for voting!'
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'statement' => 'required|string',
            'lifetime_ends_in' => 'required|date',
            'variants' => 'required|array',
        ]);

        $this->votingService->storeQuestionPoll(
            statement: $request->statement,
            lifetime_ends_in: $request->lifetime_ends_in,
            variants: $request->variants
        );

        return redirect()->route('admin.poll.index')->with('success', 'Poll created successfully.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'statement' => 'string',
            'lifetime_ends_in',
            'variants' => 'array',
        ]);

        $this->votingService->updateVotingData(
            question_id: $request->question_id,
            statement: $request->statement,
            lifetime_ends_in: $request->lifetime_ends_in,
            variants: $request->variants
        );
        return redirect()->route('poll.index')->with('success', 'Poll updated successfully.');
    }

    public function delete(Request $request)
    {
        $validatedId = $request->validate([
            'question_id' => 'required|exists:questions,id'
        ]);

        $this->votingService->deleteVoting($validatedId['question_id']);
        return redirect()->route('poll.index')->with('success', 'Poll deleted successfully.');
    }

    public function showWinner(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
        ]);

        $winner = $this->votingService->showWinnerFromSpecificPoll($request->question_id);

        return Inertia::render('Voting/Winner', [
            'winner' => $winner
        ]);
    }

    public function changeStatus(Request $request, $pollId)
    {
        $data = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $this->votingService->changePollStatus($pollId, $data['is_active']);

        return redirect()->route('poll.index')->with('success', 'Poll status updated successfully.');
    }
}
