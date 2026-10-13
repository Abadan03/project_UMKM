<?php

namespace App\Http\Requests\StoreManagement\Tax;

use Illuminate\Foundation\Http\FormRequest;

class TaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi udah di-handle middleware auth di route
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'storeId' => ['nullable', 'numeric', 'exists:stores,id'],
            'percentage' => ['required', 'numeric', 'between:0,100'],
            'is_active' => ['required', 'boolean'],
            'is_inclusive' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            // Name Validation Messages
            'name.required' => 'Tarif pajak wajib diisi.',
            'name.string' => 'Tarif pajak harus berupa angka.',

            'percentage.required' => 'Tarif pajak wajib diisi.',
            'percentage.numeric' => 'Tarif pajak harus berupa angka.',
            'percentage.between' => 'Tarif pajak harus antara 0 dan 100.',

            'is_inclusive.required' => 'Harap tentukan apakah pajak termasuk atau tidak.',
            'is_inclusive.boolean' => 'Nilai pajak termasuk harus berupa boolean.',

            'is_active.required' => 'Harap tentukan apakah pajak aktif atau tidak.',
            'is_active.boolean' => 'Nilai pajak aktif harus berupa boolean.',

            'store_id.exists' => 'Toko yang dipilih tidak valid.',

            // Tax Rate Validation Messages
            // 'tax_rate.required' => 'Tarif pajak wajib diisi.',
            // 'tax_rate.numeric' => 'Tarif pajak harus berupa angka.',
            // 'tax_rate.between' => 'Tarif pajak harus antara 0 dan 100.',

            // Tax Inclusive / Tax included Validation Messages
            // 'tax_inclusive.required' => 'Harap tentukan apakah pajak termasuk atau tidak.',
            // 'tax_inclusive.boolean' => 'Nilai pajak termasuk harus berupa boolean.',

            // Tax per user active Validation Messages
            // 'tax_active.required' => 'Harap tentukan apakah pajak aktif atau tidak.',
            // 'tax_active.boolean' => 'Nilai pajak aktif harus berupa boolean.',
        ];
    }
}