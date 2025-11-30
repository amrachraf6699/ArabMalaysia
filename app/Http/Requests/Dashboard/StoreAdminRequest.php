<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:admins,email'],
            'password' => ['required', 'string', 'min:8'],

            'phone'    => [
                'nullable',
                'string',
                'regex:/^\+[1-9]\d{7,14}$/',
                'unique:admins,phone'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب.',
            'name.string'   => 'الاسم يجب أن يكون نصًا.',
            'name.max'      => 'الاسم لا يجب أن يتجاوز 255 حرفًا.',

            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email'    => 'صيغة البريد الإلكتروني غير صحيحة.',
            'email.unique'   => 'البريد الإلكتروني مستخدم بالفعل.',

            'password.required' => 'كلمة المرور مطلوبة.',
            'password.string'   => 'كلمة المرور يجب أن تكون نصًا.',
            'password.min'      => 'كلمة المرور يجب ألا تقل عن 8 أحرف.',

            'phone.string' => 'رقم الهاتف يجب أن يكون نصًا.',
            'phone.regex'  => 'رقم الهاتف يجب أن يكون بصيغة دولية صحيحة مثل: +201012345678.',
            'phone.unique' => 'رقم الهاتف مستخدم بالفعل.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'     => 'الاسم',
            'email'    => 'البريد الإلكتروني',
            'password' => 'كلمة المرور',
            'phone'    => 'رقم الهاتف',
        ];
    }
}
