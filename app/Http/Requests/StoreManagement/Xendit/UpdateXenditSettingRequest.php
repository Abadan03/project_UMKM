<?php

namespace App\Http\Requests\StoreManagement\Xendit;

use App\Enums\XenditSettings\XenditEnvironment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateXenditSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi udah di-handle middleware auth di route
    }

    public function rules(): array
    {
        return [
            // 'environment' => ['required', Rule::enum(XenditEnvironment::class)],
            'environment' => ['required', 'in:sandbox,live'],
            'api_key' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'environment.required' => 'Environment wajib dipilih.',
            'api_key.required' => 'Secret API key wajib diisi.',
            'api_key.min' => 'Secret API key sepertinya tidak valid.',
        ];
    }
}