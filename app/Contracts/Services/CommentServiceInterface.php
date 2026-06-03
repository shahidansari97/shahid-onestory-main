<?php

namespace App\Contracts\Services;

use App\Models\Comment;

interface CommentServiceInterface
{
    public function store($data);
}
