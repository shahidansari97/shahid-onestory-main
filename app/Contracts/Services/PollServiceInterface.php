<?php

namespace App\Contracts\Services;

use App\Models\Voting\Answer;
use App\Models\Voting\Question;

interface PollServiceInterface
{
    public function getActualActiveQuestion(): Question|null;
    public function vote($question_id, $variant_id): Answer|array;
    public function storeQuestionPoll($statement, $lifetime_ends_in, $variants): Question;
    public function updatePollData($question_id, $statement = null, $lifetime_ends_in = null, $variants = null): Question|array;
    public function deletePoll($question_id): array;
    public function showWinnerFromSpecificPoll($questionId);
    public function hasUserVoted(int $questionId, ?int $userId): bool;
}
