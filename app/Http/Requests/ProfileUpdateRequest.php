<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\NoBlacklistedWords;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $preferences = $this->input('preferences');

        if (is_string($preferences)) {
            $decoded = json_decode($preferences, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['preferences' => $decoded]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'username' => ['string', 'min:3', 'max:25'],
            'is_creator' => ['nullable'],
            'avatar' => ['nullable', 'string'],
            'cover_photo' => ['nullable', 'string'],
            'generation' => ['nullable', 'string'],
            'visibility' => ['nullable'],
            'world_message' => [
                'nullable',
                'string',
                'min:3',
                'max:255',
                new NoBlacklistedWords,
            ],
            'story' => ['nullable', 'string', 'min:3', 'max:1500'],
            'country' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'preferences' => ['nullable', 'array'],
            'email' => ['string', 'lowercase', 'email', 'max:255'],
        ];
    }
}
