<?php

namespace App\Http\Requests\Dashboard;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'حقل الاسم مطلوب.',
            'name.string' => 'يجب أن يكون الاسم نصاً.',
            'name.max' => 'يجب ألا يزيد الاسم عن 255 حرفاً.',
            'name.unique' => 'اسم الدور مستخدم من قبل.',
            'permissions.array' => 'قائمة الصلاحيات يجب أن تكون مصفوفة.',
            'permissions.*.integer' => 'معرف الصلاحية غير صالح.',
            'permissions.*.exists' => 'إحدى الصلاحيات المحددة غير موجودة.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'اسم الدور',
            'permissions' => 'الصلاحيات',
        ];
    }
}
