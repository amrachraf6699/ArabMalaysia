<!DOCTYPE html>
<html dir="rtl" lang="ar">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - عرب ماليزيا</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config={darkMode:"class",theme:{extend:{fontFamily:{cairo:["Cairo","Inter","sans-serif"]}}}};
    </script>
    <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
    <link rel="stylesheet" href="{{ asset('dashboard_files/custom.css') }}">

</head>

<body class="bg-slate-50 text-slate-900">
    <div class="flex h-screen overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
            <main class="flex-1 overflow-y-auto p-6 space-y-6">
                <div
                    class="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6 animate-fade-up">
                    <div class="text-center space-y-2">
                        <div
                            class="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            <img src="{{ asset('dashboard_files/logo.png') }}" alt="عرب ماليزيا" />
                        </div>
                        <h1 class="text-2xl font-bold">تسجيل الدخول</h1>
                        <p class="text-sm text-slate-500">ادخل بياناتك للمتابعة</p>
                    </div>
                    <form class="space-y-4" method="POST" action="">
                        @csrf
                    
                        {{-- Global errors (optional) --}}
                        @if ($errors->any())
                        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                            <ul class="list-disc list-inside space-y-1">
                                @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif
                    
                        {{-- Email --}}
                        <div>
                            <label class="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                            <input type="email" name="email" value="{{ old('email') }}"
                                class="w-full px-4 py-2 rounded-lg border 
                                       @error('email') border-red-500 focus:ring-red-500 focus:border-red-500 @else border-slate-300 @enderror" placeholder="you@example.com">
                        </div>
                    
                        {{-- Password --}}
                        <div>
                            <label class="block text-sm font-medium mb-1">كلمة المرور</label>
                            <input type="password" name="password"
                                class="w-full px-4 py-2 rounded-lg border 
                                       @error('password') border-red-500 focus:ring-red-500 focus:border-red-500 @else border-slate-300 @enderror" placeholder="••••••••">
                        </div>
                    
                        {{-- Remember --}}
                        <div class="flex items-center gap-2">
                            <input id="remember" name="remember" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-blue-600" {{
                                old('remember') ? 'checked' : '' }}>
                            <label for="remember" class="text-sm">تذكرني</label>
                        </div>
                    
                        <button class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                            دخول
                        </button>
                    </form>
                </div>
            </main>
        </div>
    </div>
    <script src="{{ asset('dashboard_files/common.js') }}"></script>

</body>

</html>