// public/js/users.js
const UsersManager = {
    currentPage: 1,
    sortBy: 'created_at',
    sortDir: 'desc',
    search: '',
    prevPage: null,
    nextPage: null,
    chart: null,

    init() {
        this.setupCSRF();
        this.bindEvents();
        this.switchTab('users');
    },

    setupCSRF() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    },

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        document.getElementById('search-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadUsers();
        });

        document.getElementById('filter-from')?.addEventListener('change', () => this.loadUsers());
        document.getElementById('filter-to')?.addEventListener('change', () => this.loadUsers());
        document.getElementById('filter-per-page')?.addEventListener('change', () => this.loadUsers());

        document.getElementById('user-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'user-modal') this.closeModal();
        });
    },

    switchTab(tab) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'border-b-2', 'border-blue-500', 'text-slate-900');
            btn.classList.add('text-slate-600');
        });

        document.getElementById(`tab-${tab}`).classList.remove('hidden');
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active', 'border-b-2', 'border-blue-500', 'text-slate-900');

        if (tab === 'stats') {
            this.loadStats();
            this.loadChart();
        }
        if (tab === 'users') this.loadUsers();
    },

    showGlobalLoading() {
        document.getElementById('global-loading').classList.remove('hidden');
    },
    
    hideGlobalLoading() {
        document.getElementById('global-loading').classList.add('hidden');
    },

    showTableSkeleton() {
        document.getElementById('users-table').classList.add('hidden');
        document.getElementById('table-skeleton').classList.remove('hidden');
    },
    
    hideTableSkeleton() {
        document.getElementById('table-skeleton').classList.add('hidden');
        document.getElementById('users-table').classList.remove('hidden');
    },

    openModal(isEdit = false) {
        document.getElementById('user-modal').classList.remove('hidden');
        document.getElementById('modal-title').textContent = isEdit ? 'تعديل مستخدم' : 'إضافة مستخدم جديد';
        document.getElementById('password-hint').classList.toggle('hidden', !isEdit);
        document.querySelector('[name="password"]').toggleAttribute('required', !isEdit);
    },

    closeModal() {
        document.getElementById('user-modal').classList.add('hidden');
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('password-hint').classList.add('hidden');
        document.querySelector('[name="password"]').setAttribute('required', 'required');
    },

    loadStats() {
        const container = document.getElementById('stats-container');
        container.innerHTML = `
            <div class="skeleton h-32 rounded-lg"></div>
            <div class="skeleton h-32 rounded-lg"></div>
        `;

        axios.get('/dashboard/users/stats')
            .then(res => {
                container.innerHTML = `
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm opacity-90">إجمالي عدد المستخدمين</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <p class="text-4xl font-bold">${res.data.total_users}</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm opacity-90">المستخدمون الجدد هذا الشهر</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                        </div>
                        <p class="text-4xl font-bold">${res.data.new_this_month}</p>
                    </div>
                `;
            });
    },

    loadChart() {
        axios.get('/dashboard/users/chart-data')
            .then(res => {
                const ctx = document.getElementById('usersChart').getContext('2d');
                
                if (this.chart) {
                    this.chart.destroy();
                }

                const labels = res.data.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
                });
                const data = res.data.map(item => item.count);

                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'تسجيلات المستخدمين اليومية',
                            data: data,
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: 'rgb(59, 130, 246)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                align: 'end',
                                labels: {
                                    font: { size: 12 },
                                    padding: 15,
                                    usePointStyle: true,
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                                titleFont: { size: 13 },
                                bodyFont: { size: 12 },
                                cornerRadius: 8,
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    font: { size: 11 }
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.05)',
                                }
                            },
                            x: {
                                ticks: {
                                    font: { size: 11 }
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            })
            .catch(err => {
                console.error('Error loading chart data:', err);
            });
    },

    loadUsers(page = 1) {
        this.currentPage = page;
        this.search = document.getElementById('search-input').value.trim();
        const from = document.getElementById('filter-from').value;
        const to = document.getElementById('filter-to').value;
        const perPage = document.getElementById('filter-per-page').value;

        this.showTableSkeleton();
        document.getElementById('pagination-info').textContent = 'جاري تحميل البيانات...';

        axios.get('/dashboard/users/data', {
            params: { 
                page, 
                search: this.search, 
                sort_by: this.sortBy, 
                sort_dir: this.sortDir,
                from: from,
                to: to,
                per_page: perPage
            }
        }).then(res => {
            this.hideTableSkeleton();
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';

            if (res.data.data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.3-4.3"/>
                            </svg>
                            <p class="text-lg font-medium">لا توجد بيانات حالياً</p>
                        </td>
                    </tr>
                `;
            } else {
                res.data.data.forEach(user => {
                    const createdAt = new Date(user.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    const phoneCell = user.phone
                        ? user.phone
                        : `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold 
                                bg-red-100 text-red-700 border border-red-200">
                                لا يوجد رقم هاتف
                        </span>`;

                    tbody.innerHTML += `
                        <tr class="border-b border-slate-200 hover:bg-slate-50 transition">
                            <td class="px-6 py-5 font-medium">${user.name}</td>
                            <td class="px-6 py-5 text-slate-600">${user.email}</td>
                            <td class="px-6 py-5">${phoneCell}</td>
                            <td class="px-6 py-5 text-slate-500 text-sm">${createdAt}</td>
                            <td class="px-6 py-5">
                                <div class="flex gap-3">
                                    <button onclick="UsersManager.editUser(${user.id})" 
                                        class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                                        title="تعديل">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                            <path d="m15 5 4 4"/>
                                        </svg>
                                    </button>
                                    <button onclick="UsersManager.deleteUser(${user.id})" 
                                        class="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
                                        title="حذف">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                            <line x1="10" x2="10" y1="11" y2="17"/>
                                            <line x1="14" x2="14" y1="11" y2="17"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                });
            }

            document.getElementById('pagination-info').textContent = `عرض ${res.data.pagination.from || 0} - ${res.data.pagination.to || 0} من ${res.data.pagination.total}`;
            this.prevPage = res.data.pagination.current_page - 1;
            this.nextPage = res.data.pagination.current_page + 1;
            document.getElementById('prev-btn').disabled = res.data.pagination.current_page <= 1;
            document.getElementById('next-btn').disabled = res.data.pagination.current_page >= res.data.pagination.last_page;
        });
    },

    sortColumn(column) {
        if (this.sortBy === column) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = column;
            this.sortDir = 'desc';
        }
        this.loadUsers();
    },

    changePage(page) {
        if (page < 1) return;
        this.loadUsers(page);
    },

    resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-from').value = '';
        document.getElementById('filter-to').value = '';
        document.getElementById('filter-per-page').value = '10';
        this.loadUsers();
    },

    editUser(id) {
        this.showGlobalLoading();
        axios.get(`/dashboard/users/${id}`)
            .then(res => {
                this.hideGlobalLoading();
                document.getElementById('user-id').value = res.data.id;
                document.querySelector('[name="name"]').value = res.data.name;
                document.querySelector('[name="email"]').value = res.data.email;
                document.querySelector('[name="phone"]').value = res.data.phone || '';
                document.querySelector('[name="password"]').value = '';
                this.openModal(true);
            })
            .catch(() => {
                this.hideGlobalLoading();
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء جلب بيانات المستخدم.',
                    confirmButtonText: 'حسناً',
                    confirmButtonColor: '#2563eb'
                });
            });
    },

    deleteUser(id) {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'لن تتمكن من استرجاع هذا السجل بعد الحذف!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.showGlobalLoading();
                axios.delete(`/dashboard/users/${id}`)
                    .then(() => {
                        this.hideGlobalLoading();
                        Swal.fire({
                            icon: 'success',
                            title: 'تم الحذف!',
                            text: 'تم حذف المستخدم بنجاح.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        this.loadUsers(this.currentPage);
                    })
                    .catch(err => {
                        this.hideGlobalLoading();
                        Swal.fire({
                            icon: 'error',
                            title: 'خطأ',
                            text: err.response?.data?.message || 'حدث خطأ أثناء الحذف.',
                            confirmButtonText: 'حسناً',
                            confirmButtonColor: '#2563eb'
                        });
                    });
            }
        });
    }
};

// إرسال النموذج
document.getElementById('user-form').onsubmit = function(e) {
    e.preventDefault();
    UsersManager.showGlobalLoading();

    const id = document.getElementById('user-id').value;
    const formData = new FormData(this);
    
    const data = {};
    formData.forEach((value, key) => {
        if (value) data[key] = value;
    });

    const url = id ? `/dashboard/users/${id}` : '/dashboard/users/store';
    const method = id ? 'put' : 'post';

    axios[method](url, data)
        .then(res => {
            UsersManager.hideGlobalLoading();
            UsersManager.closeModal();
            
            Swal.fire({
                icon: 'success',
                title: 'تم بنجاح',
                text: res.data.message || 'تم حفظ البيانات بنجاح.',
                timer: 2000,
                showConfirmButton: false
            });
            
            UsersManager.loadUsers(UsersManager.currentPage);
        })
        .catch(err => {
            UsersManager.hideGlobalLoading();
            
            const message = err.response?.data?.message || 'حدث خطأ ما.';
            const errors = err.response?.data?.errors;
            
            let errorText = message;
            if (errors) {
                errorText += '\n\n' + Object.values(errors).flat().join('\n');
            }
            
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: errorText,
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#2563eb'
            });
        });
};

// تشغيل البداية
document.addEventListener('DOMContentLoaded', () => UsersManager.init());
