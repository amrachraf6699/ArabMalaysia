// public/js/roles.js
const RolesManager = {
    currentPage: 1,
    sortBy: 'created_at',
    sortDir: 'desc',
    prevPage: null,
    nextPage: null,
    chart: null,

    init() {
        this.setupCSRF();
        this.bindEvents();
        this.switchTab('roles');
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
            if (e.key === 'Enter') this.loadRoles();
        });

        document.getElementById('filter-from')?.addEventListener('change', () => this.loadRoles());
        document.getElementById('filter-to')?.addEventListener('change', () => this.loadRoles());
        document.getElementById('filter-per-page')?.addEventListener('change', () => this.loadRoles());

        document.getElementById('role-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'role-modal') this.closeModal();
        });

        document.getElementById('select-all-permissions')?.addEventListener('change', (e) => {
            const checked = e.target.checked;
            document.querySelectorAll('#permissions-list .perm-checkbox').forEach(cb => cb.checked = checked);
        });

        // FIX: Changed backticks to regular quotes
        document.querySelectorAll('.group-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const resource = e.target.dataset.resource;
                const checked = e.target.checked;
                document.querySelectorAll('#permissions-list .perm-checkbox[data-resource="' + resource + '"]').forEach(cb => cb.checked = checked);
            });
        });
    },

    switchTab(tab) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'border-b-2', 'border-blue-500', 'text-slate-900');
            btn.classList.add('text-slate-600');
        });

        // FIX: Changed backticks to regular quotes
        document.getElementById('tab-' + tab).classList.remove('hidden');
        document.querySelector('[data-tab="' + tab + '"]').classList.add('active', 'border-b-2', 'border-blue-500', 'text-slate-900');

        if (tab === 'stats') {
            this.loadStats();
            this.loadChart();
        }
        if (tab === 'roles') this.loadRoles();
    },

    showGlobalLoading() {
        document.getElementById('global-loading').classList.remove('hidden');
    },
    
    hideGlobalLoading() {
        document.getElementById('global-loading').classList.add('hidden');
    },

    showTableSkeleton() {
        document.getElementById('roles-table').classList.add('hidden');
        document.getElementById('table-skeleton').classList.remove('hidden');
    },
    
    hideTableSkeleton() {
        document.getElementById('table-skeleton').classList.add('hidden');
        document.getElementById('roles-table').classList.remove('hidden');
    },

    openModal(isEdit = false) {
        document.getElementById('role-modal').classList.remove('hidden');
        document.getElementById('modal-title').textContent = isEdit ? 'تعديل دور' : 'إضافة دور جديد';
    },

    closeModal() {
        document.getElementById('role-modal').classList.add('hidden');
        document.getElementById('role-form').reset();
        document.getElementById('role-id').value = '';
        this.fillPermissions([]);
    },

    loadStats() {
        const container = document.getElementById('stats-container');
        container.innerHTML = `
            <div class="skeleton h-32 rounded-lg"></div>
            <div class="skeleton h-32 rounded-lg"></div>
        `;

        axios.get('/dashboard/roles/stats')
            .then(res => {
                container.innerHTML = `
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm opacity-90">إجمالي عدد الأدوار</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <p class="text-4xl font-bold">${res.data.total_roles}</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm opacity-90">الأدوار المضافة هذا الشهر</p>
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
        axios.get('/dashboard/roles/chart-data')
            .then(res => {
                const ctx = document.getElementById('rolesChart').getContext('2d');
                
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
                            label: 'الأدوار المضافة يومياً',
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
                                ticks: { stepSize: 1, font: { size: 11 } },
                                grid: { color: 'rgba(0, 0, 0, 0.05)' }
                            },
                            x: {
                                ticks: { font: { size: 11 } },
                                grid: { display: false }
                            }
                        }
                    }
                });
            })
            .catch(err => {
                console.error('Error loading chart data:', err);
            });
    },

    loadRoles(page = 1) {
        this.currentPage = page;
        const search = document.getElementById('search-input').value.trim();
        const from = document.getElementById('filter-from').value;
        const to = document.getElementById('filter-to').value;
        const perPage = document.getElementById('filter-per-page').value;

        this.showTableSkeleton();
        document.getElementById('pagination-info').textContent = 'جاري تحميل البيانات...';

        axios.get('/dashboard/roles/data', {
            params: { 
                page, 
                search, 
                sort_by: this.sortBy, 
                sort_dir: this.sortDir,
                from,
                to,
                per_page: perPage
            }
        }).then(res => {
            this.hideTableSkeleton();
            const tbody = document.getElementById('roles-table-body');
            tbody.innerHTML = '';

            if (res.data.data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.3-4.3"/>
                            </svg>
                            <p class="text-lg font-medium">لا توجد بيانات حالياً</p>
                        </td>
                    </tr>
                `;
            } else {
                res.data.data.forEach(role => {
                    const createdAt = new Date(role.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    tbody.innerHTML += `
                        <tr class="border-b border-slate-200 hover:bg-slate-50 transition">
                            <td class="px-6 py-5 font-medium">${role.name}</td>
                            <td class="px-6 py-5 text-slate-600">${role.permissions_count}</td>
                            <td class="px-6 py-5 text-slate-500 text-sm">${createdAt}</td>
                            <td class="px-6 py-5">
                                <div class="flex gap-3">
                                    <button onclick="RolesManager.editRole(${role.id})" 
                                        class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
                                        title="تعديل">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                            <path d="m15 5 4 4"/>
                                        </svg>
                                    </button>
                                    <button onclick="RolesManager.deleteRole(${role.id})" 
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
        this.loadRoles();
    },

    changePage(page) {
        if (page < 1) return;
        this.loadRoles(page);
    },

    resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-from').value = '';
        document.getElementById('filter-to').value = '';
        document.getElementById('filter-per-page').value = '10';
        this.loadRoles();
    },

    fillPermissions(permissionIds = []) {
        document.querySelectorAll('#permissions-list input[name="permissions[]"]').forEach(cb => {
            cb.checked = permissionIds.includes(parseInt(cb.value, 10));
        });

        // تحديث حالة تحديد الجميع
        const allCheckbox = document.getElementById('select-all-permissions');
        if (allCheckbox) {
            const allPerms = Array.from(document.querySelectorAll('#permissions-list .perm-checkbox'));
            allCheckbox.checked = allPerms.length > 0 && allPerms.every(cb => cb.checked);
        }

        // تحديث حالة كل مجموعة - FIX: Changed backticks to regular quotes
        document.querySelectorAll('.group-toggle').forEach(toggle => {
            const resource = toggle.dataset.resource;
            const groupPerms = Array.from(document.querySelectorAll('#permissions-list .perm-checkbox[data-resource="' + resource + '"]'));
            toggle.checked = groupPerms.length > 0 && groupPerms.every(cb => cb.checked);
        });
    },

    collectPermissions() {
        return Array.from(
            document.querySelectorAll('#permissions-list input[name="permissions[]"]:checked')
        ).map(cb => parseInt(cb.value, 10));
    },

    editRole(id) {
        this.showGlobalLoading();
        // FIX: Changed backticks to regular quotes
        axios.get('/dashboard/roles/' + id)
            .then(res => {
                this.hideGlobalLoading();
                document.getElementById('role-id').value = res.data.id;
                document.querySelector('[name="name"]').value = res.data.name;
                this.fillPermissions(res.data.permissions);
                this.openModal(true);
            })
            .catch(() => {
                this.hideGlobalLoading();
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء جلب بيانات الدور.',
                    confirmButtonText: 'حسناً',
                    confirmButtonColor: '#2563eb'
                });
            });
    },

    deleteRole(id) {
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
                // FIX: Changed backticks to regular quotes
                axios.delete('/dashboard/roles/' + id)
                    .then(() => {
                        this.hideGlobalLoading();
                        Swal.fire({
                            icon: 'success',
                            title: 'تم الحذف!',
                            text: 'تم حذف الدور بنجاح.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        this.loadRoles(this.currentPage);
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
document.getElementById('role-form').onsubmit = function(e) {
    e.preventDefault();
    RolesManager.showGlobalLoading();

    const id = document.getElementById('role-id').value;
    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        if (key === 'permissions[]') return; // سنجمعها يدوياً
        data[key] = value;
    });

    data.permissions = RolesManager.collectPermissions();

    const url = id ? '/dashboard/roles/' + id : '/dashboard/roles/store';
    const method = id ? 'put' : 'post';

    axios[method](url, data)
        .then(res => {
            RolesManager.hideGlobalLoading();
            RolesManager.closeModal();
            
            Swal.fire({
                icon: 'success',
                title: 'تم بنجاح',
                text: res.data.message || 'تم حفظ البيانات بنجاح.',
                timer: 2000,
                showConfirmButton: false
            });
            
            RolesManager.loadRoles(RolesManager.currentPage);
        })
        .catch(err => {
            RolesManager.hideGlobalLoading();
            
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
document.addEventListener('DOMContentLoaded', () => RolesManager.init());