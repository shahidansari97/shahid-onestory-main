<?php

namespace App\Services;

use App\Contracts\Services\PollServiceInterface;
use App\Models\User;
use App\Models\Voting\Answer;
use App\Models\Voting\Question;
use App\Models\Voting\Variant;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PollService implements PollServiceInterface
{
    private User $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function getActualActiveQuestion(): ?Question
    {
        return Question::where('is_active', true)->orderBy('created_at')->first();
    }

    public function vote($question_id, $variant_id): Answer|array
    {
        $questionLifetime = Question::find($question_id)->lifetime_ends_in;

        if ($questionLifetime <= Carbon::now()->format('Y-m-d')) {
            return ['error' => 'The voting is ended.'];
        }

//        if (Answer::where('user_id', $this->user->id)->first()) {
//            return ['error' => 'You have already cast your vote in this poll.'];
//        }

        return Answer::create([
            'question_id' => $question_id,
            'variant_id' => $variant_id,
            'user_id' => $this->user->id,
        ]);
    }

    public function storeQuestionPoll($statement, $lifetime_ends_in, $variants): Question
    {
        // Створюємо нове опитування
        $question = Question::create([
            'statement' => $statement,
            'lifetime_ends_in' => Carbon::createFromFormat('Y-m-d', $lifetime_ends_in)->format('Y-m-d'),
        ]);

        if ($variants) {
            // Присвоюємо вибрані варіанти цьому опитуванню
            Variant::whereIn('id', $variants)->update(['question_id' => $question->id]);
        }

        return $question;
    }
    public function changePollStatus($pollId, $isActive)
    {
        if ($isActive) {
            Question::where('is_active', true)->update(['is_active' => false]);
        }

        $poll = Question::findOrFail($pollId);

        $poll->is_active = $isActive;
        $poll->save();
    }


    public function getAllPolls()
    {
        return Question::with('variants')->get();
    }

    public function getPollById($pollId)
    {
        return Question::with(['variants.answers.user'])->findOrFail($pollId);
    }

    public function updatePollData($question_id, $statement = null, $lifetime_ends_in = null, $variants = null): Question|array
    {
        $question = Question::find($question_id);

        if (!$question) {
            return ['error' => "Question doesn't exist with provided ID."];
        }

        if (isset($statement)) {
            $question->statement = $statement;
        }

        if (isset($lifetime_ends_in)) {
            $question->lifetime_ends_in = Carbon::createFromFormat('Y-m-d', $lifetime_ends_in)->format('Y-m-d');
        }

        if (isset($variants)) {
            // Відміняємо асоціацію варіантів, які більше не вибрані
            Variant::where('question_id', $question->id)
                ->whereNotIn('id', $variants)
                ->update(['question_id' => null]);

            // Присвоюємо нові вибрані варіанти цьому опитуванню
            Variant::whereIn('id', $variants)->update(['question_id' => $question->id]);
        }

        $question->save();

        return $question->load('variants');
    }

    public function deletePoll($question_id): array
    {
        $poll = Question::find($question_id);

        if (!$poll) {
            return ['error' => 'Poll not found.'];
        }

        $poll->delete();

        return ['success' => 'Poll has been removed.'];
    }

    public function showWinnerFromSpecificPoll($questionId)
    {
        return DB::table('answers')
            ->join('variants', 'answers.variant_id', '=', 'variants.id')
            ->join('questions', 'answers.question_id', '=', 'questions.id')
            ->select('answers.variant_id', 'variants.*', DB::raw('COUNT(answers.question_id) AS voices'))
            ->where('questions.id', $questionId)
            ->groupBy('answers.variant_id')
            ->orderBy('voices', 'desc')
            ->first();
    }
    public function getVariantsForQuestion($question_id)
    {
        return Variant::where('question_id', $question_id)->get();
    }
    public function hasUserVoted(int $questionId, ?int $userId): bool
    {
        return Answer::where('question_id', $questionId)
            ->where('user_id', $userId)
            ->exists();
    }
}
