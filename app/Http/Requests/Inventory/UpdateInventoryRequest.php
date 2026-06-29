<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'qty' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'isActive' => ['required', 'in:YES,NO'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'qty.required' => 'Stock cannot be empty.',
            'qty.integer' => 'Stock must be a number.',
            'qty.min' => 'Stock cannot be negative.',
            'minimum_stock.required' => 'Minimum stock cannot be empty.',
            'minimum_stock.integer' => 'Minimum stock must be a number.',
            'minimum_stock.min' => 'Minimum stock cannot be negative.',
            'isActive.required' => 'Inventory status cannot be empty.',
            'isActive.in' => 'Inventory status is not valid.',
            'user_id.exists' => 'User is not valid.',
        ];
    }
}
