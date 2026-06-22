<?php

namespace App\Http\Requests\Products;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
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
            'qty' => 'required|integer|min:0',
            'unit_id' => 'required|string',
            'pricing' => 'required|numeric|min:0',
            'description' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name cannot be empty.',
            'name.string' => 'Product name must be text.',
            'name.max' => 'Product name is too long (max 255 characters).',

            'qty.required' => 'Quantity is required.',
            'qty.integer' => 'Quantity is not valid.',
            'qty.min' => 'Quantity cannot be negative.',

            'unit_id.required' => 'Unit is required.',

            'pricing.required' => 'Pricing is required.',
            'pricing.numeric' => 'Pricing must be a number.',
            'pricing.min' => 'Pricing cannot be negative.',

            'description.required' => 'Description cannot be empty.',
            'description.string' => 'Description must be text.',
        ];
    }
}
