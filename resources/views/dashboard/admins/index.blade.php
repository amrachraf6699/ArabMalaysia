<x-dashboard.layout title="المسؤلين">
    <!-- Global Loading Overlay -->
    <div id="global-loading" class="fixed inset-0 bg-black bg-opacity-40 z-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center">
            <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <p class="text-lg font-medium text-slate-700">جاري المعالجة...</p>
        </div>
    </div>

    <!-- Modal -->
    <div id="admin-modal" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 id="modal-title" class="text-2xl font-bold text-slate-800">إضافة مسؤول جديد</h2>
                <button onclick="AdminsManager.closeModal()" class="text-slate-400 hover:text-slate-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <!-- Modal Body -->
            <form id="admin-form" class="p-6">
                @csrf
                <input type="hidden" id="admin-id">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">الاسم الكامل</label>
                        <input type="text" name="name" required
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
                        <input type="email" name="email" required
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">كلمة المرور</label>
                        <input type="password" name="password" required
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                        <p id="password-hint" class="text-xs text-slate-500 mt-1 hidden">اتركه فارغاً إذا كنت لا تريد
                            تغييره</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">رقم الهاتف</label>
                        <input type="text" name="phone"
                            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                    <button type="submit"
                        class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                        حفظ المسؤول
                    </button>
                    <button type="button" onclick="AdminsManager.closeModal()"
                        class="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <!-- Tabs -->
        <div class="flex border-b border-slate-200">
            <button class="tab-btn flex-1 px-6 py-3 text-center font-medium text-slate-600"
                data-tab="stats">إحصائيات</button>
            <button
                class="tab-btn flex-1 px-6 py-3 text-center font-medium active border-b-2 border-blue-500 text-slate-900"
                data-tab="users">المسؤلون</button>
        </div>

        <!-- Stats Tab -->
        <div id="tab-stats" class="tab-content p-6 hidden">
            <!-- Statistics Cards -->
            <div id="stats-container" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- سيتم ملؤها ديناميكيًا -->
            </div>

            <!-- Chart -->
            <div class="bg-slate-50 rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 class="text-lg font-semibold mb-6 text-slate-800">المسؤولون المضافون (آخر 30 يوم)</h3>
                <canvas id="adminsChart" class="w-full" style="max-height: 400px;"></canvas>
            </div>
        </div>

        <!-- Users Tab -->
        <div id="tab-users" class="tab-content p-6">
            <!-- Header with Add Button -->
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-slate-800">إدارة المسؤولين</h2>
                <button onclick="AdminsManager.openModal()"
                    class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    إضافة مسؤول
                </button>
            </div>

            <!-- Filters -->
            <div class="mb-6 space-y-4">
                <div class="flex flex-wrap gap-4">
                    <input type="text" id="search-input"
                        class="flex-1 min-w-[250px] px-5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="ابحث بالاسم أو البريد...">

                    <input type="date" id="filter-from"
                        class="px-5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">

                    <input type="date" id="filter-to"
                        class="px-5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">

                    <select id="filter-per-page"
                        class="px-5 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                        <option value="10">10 نتائج</option>
                        <option value="25">25 نتيجة</option>
                        <option value="50">50 نتيجة</option>
                        <option value="100">100 نتيجة</option>
                    </select>

                    <button onclick="AdminsManager.loadAdmins()"
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">بحث</button>

                    <button onclick="AdminsManager.resetFilters()"
                        class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition">إعادة
                        تعيين</button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <!-- Skeleton Table -->
                <table id="table-skeleton" class="w-full text-sm hidden">
                    <tbody>
                        @for($i = 0; $i < 2; $i++) <tr class="border-b border-slate-200">
                            <td class="px-6 py-5">
                                <div class="skeleton h-5 w-32 rounded"></div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="skeleton h-5 w-48 rounded"></div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="skeleton h-5 w-28 rounded"></div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="skeleton h-8 w-32 rounded"></div>
                            </td>
                            </tr>
                            @endfor
                    </tbody>
                </table>

                <!-- Real Table -->
                <table id="admins-table" class="w-full min-w-[720px] text-sm">
                    <thead class="bg-slate-50">
                        <tr>
                            <th class="px-6 py-4 text-right font-semibold cursor-pointer hover:bg-slate-100 transition"
                                onclick="AdminsManager.sortColumn('name')">الاسم</th>
                            <th class="px-6 py-4 text-right font-semibold cursor-pointer hover:bg-slate-100 transition"
                                onclick="AdminsManager.sortColumn('email')">البريد الإلكتروني</th>
                            <th class="px-6 py-4 text-right font-semibold">رقم الهاتف</th>
                            <th class="px-6 py-4 text-right font-semibold cursor-pointer hover:bg-slate-100 transition"
                                onclick="AdminsManager.sortColumn('created_at')">تاريخ الإضافة</th>
                            <th class="px-6 py-4 text-right font-semibold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="admins-table-body"></tbody>
                </table>
            </div>

            <div class="flex items-center justify-between mt-6">
                <div id="pagination-info" class="text-sm text-slate-600">جاري التحميل...</div>
                <div class="flex gap-3">
                    <button id="prev-btn" onclick="AdminsManager.changePage(AdminsManager.prevPage)" disabled
                        class="px-5 py-3 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition">السابق</button>
                    <button id="next-btn" onclick="AdminsManager.changePage(AdminsManager.nextPage)" disabled
                        class="px-5 py-3 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition">التالي</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/admins.js') }}"></script>


</x-dashboard.layout>