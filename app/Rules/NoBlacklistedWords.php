<?php

namespace App\Rules;

use App\Models\BlacklistedWord;
use Illuminate\Contracts\Validation\Rule;

class NoBlacklistedWords implements Rule
{
    public function passes($attribute, $value)
    {
        $blacklistedWords = BlacklistedWord::pluck('word')->toArray();

        foreach ($blacklistedWords as $word) {
            if (stripos($value, $word) !== false) {
                return false;
            }
        }

        return true;
    }

    public function message()
    {
        return 'The :attribute contains forbidden words.';
    }
}
