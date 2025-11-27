<?php

namespace App\Http\Controllers\Dashboard\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\Auth\LoginRequest;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (Auth::guard('admin')->attempt($credentials, $remember)) {
            $request->session()->regenerate();

            return redirect()
                ->route('dashboard.home')
                ->with('success', 'تم تسجيل الدخول بنجاح.');
        }

        return back()
            ->withErrors([
                'email' => 'بيانات الدخول غير صحيحة.',
            ])
            ->onlyInput('email');
    }
}
