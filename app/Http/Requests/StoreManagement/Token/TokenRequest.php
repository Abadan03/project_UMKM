<?php

namespace App\Http\Requests\StoreManagement\Token;

use Illuminate\Foundation\Http\FormRequest;

class TokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi udah di-handle middleware auth di route
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'Token wajib diisi.',
            'token.string' => 'Token harus berupa string.',
            'token.min' => 'Token sepertinya tidak valid.',
        ];
    }
}