<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PollServiceInterface;
use App\Models\Voting\Variant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PollController extends Controller
{
    private PollServiceInterface $pollService;

    public function __construct(PollServiceInterface $pollService)
    {
        $this->pollService = $pollService;
    }

    public function create()
    {
        $allVariants = Variant::all();

        return Inertia::render('Dashboard/Poll/Create', [
            'allVariants' => $allVariants,
        ]);
    }
    public function index()
    {
        $polls = $this->pollService->getAllPolls();

        return Inertia::render('Dashboard/Poll/Index', [
            'polls' => $polls,
        ]);
    }

    public function vote(Request $request)
    {
        $data = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'variant_id' => 'required|exists:variants,id',
        ]);

        $result = $this->pollService->vote(
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

        $this->pollService->storeQuestionPoll(
            statement: $request->statement,
            lifetime_ends_in: $request->lifetime_ends_in,
            variants: $request->variants
        );

        return redirect()->route('admin.poll.index')->with('success', 'Poll created successfully.');
    }

    public function show($pollId)
    {
        $poll = $this->pollService->getPollById($pollId);

        if (!$poll) {
            return redirect()->route('admin.poll.index')->with('error', 'Poll not found.');
        }

        return Inertia::render('Dashboard/Poll/Show', [
            'poll' => $poll,
        ]);
    }
    public function edit($pollId)
    {
        $poll = $this->pollService->getPollById($pollId);

        if (!$poll) {
            return redirect()->route('admin.poll.index')->with('error', 'Poll not found.');
        }

        $allVariants = Variant::all();

        return Inertia::render('Dashboard/Poll/Edit', [
            'poll' => $poll->load('variants'),
            'allVariants' => $allVariants,
        ]);
    }

    public function update(Request $request, $pollId)
    {
        $validatedData = $request->validate([
            'statement' => 'required|string',
            'lifetime_ends_in' => 'required|date',
            'variants' => 'required|array|min:1',
            'variants.*' => 'exists:variants,id',
        ]);

        $updateResult = $this->pollService->updatePollData(
            $pollId,
            $validatedData['statement'],
            $validatedData['lifetime_ends_in'],
            $validatedData['variants']
        );

        if (isset($updateResult['error'])) {
            return redirect()->back()->with('error', $updateResult['error']);
        }

        return redirect()->route('admin.poll.index')->with('success', 'Poll updated successfully.');
    }


    public function delete(Request $request)
    {
        $validatedId = $request->validate([
            'poll_id' => 'required|exists:questions,id'
        ]);

        $deleteResult = $this->pollService->deletePoll($validatedId['poll_id']);

        if (isset($deleteResult['error'])) {
            return redirect()->route('admin.poll.index')->with('error', $deleteResult['error']);
        }

        return redirect()->route('admin.poll.index')->with('success', 'Poll deleted successfully.');
    }

    public function showWinner(Request $request)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
        ]);

        $winner = $this->pollService->showWinnerFromSpecificPoll($request->question_id);

        return Inertia::render('Voting/Winner', [
            'winner' => $winner
        ]);
    }

    public function changeStatus(Request $request, $pollId)
    {
        $data = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $this->pollService->changePollStatus($pollId, $data['is_active']);

        return redirect()->route('admin.poll.index')->with('success', 'Poll status updated successfully.');
    }
}
