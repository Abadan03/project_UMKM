<?php

namespace App\Http\Requests\POS;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use PhpParser\Node\Stmt\TryCatch;

class POSRequest extends FormRequest
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
        // return [
        //     'name' => 'required|string|max:255',
        //     'description' => 'required|string|max:255|nullable',
        // ];

        return [
            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.product_id' => [
                'required',
                'integer',
                'exists:t_products,id',
            ],

            'items.*.qty' => [
                'required',
                'integer',
                'min:1',
            ],

            'cash_received' => [
                'required_if:payment_method,CASH',
                'numeric',
                'min:0',
            ],

            'payment_method' => [
                'required',
                'in:CASH,E-PAYMENT',
            ],
        ];
    }

    public function messages(): array
    {
        // return [
        //     'name.required' => 'Name is required.',
        //     'name.string' => 'Name must be a string.',
        //     'name.max' => 'Name must not exceed 255 characters.',
        //     'description.max' => 'Name must not exceed 255 characters.',
        // ];

        return [
            'items.required' => 'Keranjang tidak boleh kosong.',
            'items.array' => 'Format item tidak valid.',
            'items.min' => 'Minimal ada satu produk.',

            'items.*.product_id.required' => 'Produk wajib dipilih.',
            'items.*.product_id.integer' => 'ID produk tidak valid.',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',

            'items.*.qty.required' => 'Jumlah produk wajib diisi.',
            'items.*.qty.integer' => 'Jumlah produk harus berupa angka.',
            'items.*.qty.min' => 'Jumlah produk minimal 1.',

            'cash_received.required' => 'Nominal pembayaran wajib diisi.',
            'cash_received.numeric' => 'Nominal pembayaran harus berupa angka.',
            'cash_received.min' => 'Nominal pembayaran tidak boleh kurang dari 0.',
        ];
    }
}
