<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\NoBlacklistedWords;

class StoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
	
        return [
            'userId' => 'required|exists:users,id',
	        'previewUrl' => 'required',
            'categories' => 'required|array',
            'thumbnailUrl' => 'required',
            's3Url' => 'required|string',
            'masterUrl' => 'required|string'
        ];
        // return [
        //     'user_id' => 'required|exists:users,id',
        //     // 'categories' => 'required|array',
        //     // 'name' => [
        //     //     'required',
        //     //     'string',
        //     //     new NoBlacklistedWords,
        //     // ],
        //     // 'thumbnail' => 'required|file|mimes:jpeg,png',
        //     'src' => 'required|string',
        // ];
    }
}
