@props(['title' => 'لوحة التحكم'])
<!DOCTYPE html>
<html dir="rtl" lang="ar">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }} - لوحة التحكم</title>
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
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <link rel="stylesheet" href="{{ asset('dashboard_files/custom.css') }}">
</head>

<body class="bg-slate-50 text-slate-900">
    <div class="flex h-screen overflow-hidden">
        <aside id="sidebar"
            class="fixed lg:relative inset-y-0 right-0 z-40 w-64 bg-white border-l border-slate-200 transition-all duration-300 transform -translate-x-full lg:translate-x-0 overflow-y-auto flex flex-col"
            style="max-height:100vh;">
            <div class="flex-shrink-0 px-4 py-6 border-b border-slate-200">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold">
                        <img src="{{ asset('dashboard_files/logo.png') }}" />
                    </div>
                    <div class="flex-1">
                        <h1 class="text-lg font-bold">عرب ماليزيا</h1>
                    </div>
                </div>
            </div>
            @php
            $activeClass = 'flex items-center gap-3 px-4 py-3 rounded-lg text-blue-700 bg-blue-50 border
            border-blue-100';
            $inactiveClass = 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100
            transition-colors';
            @endphp
            
            
            <nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                <a href="{{ route('dashboard.home') }}"
                    class="{{ request()->routeIs('dashboard.home') ? $activeClass : $inactiveClass }}"><svg
                        data-lucide="home" class="w-5 h-5"></svg><span class="sidebar-label">لوحة التحكم</span></a>

                @can('admins_read')
                <a href="{{ route('dashboard.admins.index') }}"
                    class="{{ request()->routeIs('dashboard.admins.*') ? $activeClass : $inactiveClass }}"><svg
                        data-lucide="shield" class="w-5 h-5"></svg><span class="sidebar-label">المشرفون</span></a>
                @endcan

                @can('users_read')
                <a href="{{ route('dashboard.users.index') }}"
                    class="{{ request()->routeIs('dashboard.users.*') ? $activeClass : $inactiveClass }}"><svg
                        data-lucide="users" class="w-5 h-5"></svg><span class="sidebar-label">المستخدمون</span></a>
                @endcan

                @can('roles_read')
                <a href="{{ route('dashboard.roles.index') }}"
                    class="{{ request()->routeIs('dashboard.roles.*') ? $activeClass : $inactiveClass }}">
                    <svg data-lucide="key-round" class="w-5 h-5"></svg>
                    <span class="sidebar-label">الأدوار والصلاحيات</span>
                </a>
                @endcan
            </nav>


        </aside>
        <div class="flex-1 flex flex-col overflow-hidden">
            <header
                class="flex-shrink-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
                <div class="flex items-center gap-4">
                    <button id="sidebar-toggle" class="lg:hidden text-slate-600 hover:text-slate-900"><svg
                            data-lucide="menu" class="w-6 h-6"></svg></button>
                    <h1 class="text-xl font-bold">{{ $title }}</h1>
                </div>
                <div class="flex items-center gap-3">
                    <button class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {{ Str::limit(auth()->user()->name, 1, '') }}
                    </button>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto p-6 space-y-6">
                {{ $slot }}
            </main>
        </div>
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 hidden lg:hidden"></div>
    </div>
    <div id="toast-container" class="fixed bottom-4 right-4 z-40 space-y-2"></div>
    <script src="{{ asset('dashboard_files/common.js') }}"></script>
</body>

</html>
