<?php

namespace App\Http\Requests\Categories;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use PhpParser\Node\Stmt\TryCatch;

class CategoriesRequest extends FormRequest
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
            'description' => 'string|max:255|nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'name.max' => 'Name must not exceed 255 characters.',
            'description.max' => 'Name must not exceed 255 characters.',
            // 'description.nullable' => 'Name must not exceed 255 characters.',

        ];
    }
}
