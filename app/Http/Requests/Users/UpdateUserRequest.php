<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Hash;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('userId');
        $isChangingPassword = $this->boolean('change_password');


        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'roles_id' => ['required', 'exists:t_roles,id'],
            'old_password' => $isChangingPassword ? 'required|string' : 'nullable',
            'password' => $isChangingPassword ? 'required|min:8' : 'nullable',
            'password_confirmation' => $isChangingPassword ? 'required' : 'nullable',
        ];
    }

    public function validateOldPassword(): bool
    {
        $user = User::find($this->route('userId'));
        return $user && Hash::check($this->old_password, $user->password);
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a valid string.',
            'name.max' => 'The name may not be greater than 255 characters.',

            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',

            'roles_id.required' => 'The role field is required.',
            'roles_id.exists' => 'The selected role is invalid.',

            'password.min' => 'The password must be at least 8 characters.',
            'old_password' => 'The old password does not match.',
            'password_confirmation' => 'Password confirmation does not match.',
        ];
    }
}