<?php

namespace App\Http\Requests\Dashboard\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admin')->guest();
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'email', 'exists:admins,email'],
            'password' => ['required', 'min:6'],
            'remember' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'من فضلك أدخل البريد الإلكتروني.',
            'email.email'    => 'من فضلك أدخل بريد إلكتروني صحيح.',
            'email.exists'   => 'هذا البريد غير مسجل لدينا كمسؤول.',

            'password.required' => 'من فضلك أدخل كلمة المرور.',
            'password.min'      => 'كلمة المرور يجب ألا تقل عن 6 أحرف.',

            'remember.boolean'  => 'قيمة "تذكرني" غير صحيحة.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'البريد الإلكتروني',
            'password' => 'كلمة المرور',
            'remember' => 'تذكرني',
        ];
    }
}
