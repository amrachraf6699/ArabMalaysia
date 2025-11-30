<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone'    => ['nullable', 'string', 'regex:/^\\+[1-9]\\d{7,14}$/', 'unique:users,phone'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'حقل الاسم مطلوب.',
            'name.string'   => 'يجب أن يكون الاسم نصاً.',
            'name.max'      => 'يجب ألا يزيد الاسم عن 255 حرفاً.',

            'email.required' => 'حقل البريد الإلكتروني مطلوب.',
            'email.email'    => 'يجب إدخال بريد إلكتروني صالح.',
            'email.unique'   => 'البريد الإلكتروني مستخدم من قبل.',

            'password.required' => 'حقل كلمة المرور مطلوب.',
            'password.string'   => 'يجب أن تكون كلمة المرور نصاً.',
            'password.min'      => 'يجب ألا تقل كلمة المرور عن 8 أحرف.',

            'phone.string' => 'يجب أن يكون رقم الهاتف نصاً.',
            'phone.regex'  => 'يرجى إدخال رقم هاتف بصيغة صحيحة مثل: ‎+201012345678.',
            'phone.unique' => 'رقم الهاتف مستخدم من قبل.',
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
