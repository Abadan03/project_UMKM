<?php

namespace App\Http\Requests\Sales;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateSalesRequest extends FormRequest
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
            // =========================
            // SALES
            // =========================
            'invoice_number' => [
                'required',
                'string',
                'max:255',
            ],

            // 'cashier_id' => [
            //     'required',
            //     'integer',
            //     'exists:t_staff,id',
            // ],

            // 'cashier_name' => [
            //     'required',
            //     'string',
            //     'max:255',
            // ],

            'transaction_date' => [
                'required',
                'date',
            ],

            'subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            'discount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'tax' => [
                'required',
                'numeric',
                'min:0',
            ],

            'grand_total' => [
                'required',
                'numeric',
                'min:0',
            ],

            'payment_method' => [
                'required',
                'string',
                'max:255',
            ],

            'payment_status' => [
                'required',
                'string',
                'max:255',
            ],

            'status' => [
                'required',
                'string',
                'max:255',
            ],

            // =========================
            // SALES ITEMS
            // =========================
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

            'items.*.quantity' => [
                'required',
                'numeric',
                'min:1',
            ],

            'items.*.price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items.*.discount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'items.*.subtotal' => [
                'required',
                'numeric',
                'min:0',
            ],

            // =========================
            // TRANSACTION
            // =========================
            'transaction' => [
                'required',
                'array',
            ],

            'transaction.transaction_type' => [
                'required',
                'string',
                'max:255',
            ],

            'transaction.amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'transaction.payment_method' => [
                'required',
                'string',
                'max:255',
            ],

            'transaction.reference_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'transaction.processed_at' => [
                'required',
                'date',
            ],

            'transaction.status' => [
                'required',
                'string',
                'max:255',
            ],

            'transaction.notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            // =========================
            // SALES
            // =========================
            'invoice_id.required' => 'Invoice ID is required.',
            'invoice_id.string' => 'Invoice ID must be a string.',
            'invoice_id.max' => 'Invoice ID may not exceed 255 characters.',

            'cashier_id.required' => 'Cashier is required.',
            'cashier_id.integer' => 'Cashier ID must be a valid number.',
            'cashier_id.exists' => 'The selected cashier does not exist.',

            'cashier_name.required' => 'Cashier name is required.',
            'cashier_name.string' => 'Cashier name must be a string.',
            'cashier_name.max' => 'Cashier name may not exceed 255 characters.',

            'transaction_date.required' => 'Transaction date is required.',
            'transaction_date.date' => 'Transaction date is invalid.',

            'subtotal.required' => 'Subtotal is required.',
            'subtotal.numeric' => 'Subtotal must be a number.',
            'subtotal.min' => 'Subtotal cannot be less than 0.',

            'discount.required' => 'Discount is required.',
            'discount.numeric' => 'Discount must be a number.',
            'discount.min' => 'Discount cannot be less than 0.',

            'tax.required' => 'Tax is required.',
            'tax.numeric' => 'Tax must be a number.',
            'tax.min' => 'Tax cannot be less than 0.',

            'grand_total.required' => 'Grand total is required.',
            'grand_total.numeric' => 'Grand total must be a number.',
            'grand_total.min' => 'Grand total cannot be less than 0.',

            'payment_method.required' => 'Payment method is required.',
            'payment_method.string' => 'Payment method must be a string.',
            'payment_method.max' => 'Payment method may not exceed 255 characters.',

            'payment_status.required' => 'Payment status is required.',
            'payment_status.string' => 'Payment status must be a string.',
            'payment_status.max' => 'Payment status may not exceed 255 characters.',

            'status.required' => 'Sales status is required.',
            'status.string' => 'Sales status must be a string.',
            'status.max' => 'Sales status may not exceed 255 characters.',

            // =========================
            // SALES ITEMS
            // =========================
            'items.required' => 'At least one item is required.',
            'items.array' => 'Items data must be an array.',
            'items.min' => 'At least one item must be added.',

            'items.*.product_id.required' => 'Product is required.',
            'items.*.product_id.integer' => 'Product ID must be a valid number.',
            'items.*.product_id.exists' => 'The selected product does not exist.',

            'items.*.quantity.required' => 'Quantity is required.',
            'items.*.quantity.numeric' => 'Quantity must be a number.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',

            'items.*.price.required' => 'Product price is required.',
            'items.*.price.numeric' => 'Product price must be a number.',
            'items.*.price.min' => 'Product price cannot be less than 0.',

            'items.*.discount.required' => 'Item discount is required.',
            'items.*.discount.numeric' => 'Item discount must be a number.',
            'items.*.discount.min' => 'Item discount cannot be less than 0.',

            'items.*.subtotal.required' => 'Item subtotal is required.',
            'items.*.subtotal.numeric' => 'Item subtotal must be a number.',
            'items.*.subtotal.min' => 'Item subtotal cannot be less than 0.',

            // =========================
            // TRANSACTION
            // =========================
            'transaction.required' => 'Transaction data is required.',
            'transaction.array' => 'Transaction data must be an array.',

            'transaction.transaction_type.required' => 'Transaction type is required.',
            'transaction.transaction_type.string' => 'Transaction type must be a string.',
            'transaction.transaction_type.max' => 'Transaction type may not exceed 255 characters.',

            'transaction.amount.required' => 'Transaction amount is required.',
            'transaction.amount.numeric' => 'Transaction amount must be a number.',
            'transaction.amount.min' => 'Transaction amount cannot be less than 0.',

            'transaction.payment_method.required' => 'Transaction payment method is required.',
            'transaction.payment_method.string' => 'Payment method must be a string.',
            'transaction.payment_method.max' => 'Payment method may not exceed 255 characters.',

            'transaction.reference_number.string' => 'Reference number must be a string.',
            'transaction.reference_number.max' => 'Reference number may not exceed 255 characters.',

            'transaction.processed_at.required' => 'Processed date is required.',
            'transaction.processed_at.date' => 'Processed date is invalid.',

            'transaction.status.required' => 'Transaction status is required.',
            'transaction.status.string' => 'Transaction status must be a string.',
            'transaction.status.max' => 'Transaction status may not exceed 255 characters.',

            'transaction.notes.string' => 'Transaction notes must be a string.',
            'transaction.notes.max' => 'Transaction notes may not exceed 1000 characters.',
        ];
    }
}