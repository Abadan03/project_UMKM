<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use PhpParser\Node\Stmt\TryCatch;

class CreateStaffRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'pin' => 'required|integer',
            'roles_id' => 'required|exists:t_roles,id',
            'users_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'name.max' => 'Name must not exceed 255 characters.',
            'pin.required' => 'Pin is required.',
            'pin.integer' => 'Pin must be an integer.',
            'roles_id.required' => 'Role is required.',
            'roles_id.exists' => 'Selected role does not exist.',
            'users_id.required' => 'User is required.',
            'users_id.exists' => 'Selected user does not exist.',
        ];
    }
}
