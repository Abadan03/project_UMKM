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
            'qty' => 'integer|min:0',
            'unit_id' => 'required|string',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name cannot be empty.',
            'name.string' => 'Product name must be text.',
            'name.max' => 'Product name is too long (max 255 characters).',

            // 'qty.required' => 'Quantity is required.',
            'qty.integer' => 'Quantity is not valid.',
            'qty.min' => 'Quantity cannot be negative.',

            'unit_id.required' => 'Unit is required.',

            'cost_price.required' => 'Cost price is required.',
            'cost_price.numeric' => 'Cost price must be a number.',
            'cost_price.min' => 'Cost price cannot be negative.',

            'sell_price.required' => 'Sell price is required.',
            'sell_price.numeric' => 'Sell price must be a number.',
            'sell_price.min' => 'Sell price cannot be negative.',

            'description.required' => 'Description cannot be empty.',
            'description.string' => 'Description must be text.',
        ];
    }
}
