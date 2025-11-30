<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreRoleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    public function index()
    {
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        $resourcesMap = [
            'admins' => 'المشرفون',
            'users'  => 'المستخدمون',
            'roles'  => 'الأدوار',
        ];

        $actionsMap = [
            'create' => 'إضافة',
            'read'   => 'عرض',
            'update' => 'تعديل',
            'delete' => 'حذف',
        ];

        $grouped = [];
        foreach ($permissions as $permission) {
            [$resource, $action] = explode('_', $permission->name);
            $grouped[$resource]['label'] = $resourcesMap[$resource] ?? $resource;
            $grouped[$resource]['items'][] = [
                'id' => $permission->id,
                'name' => $permission->name,
                'action' => $actionsMap[$action] ?? $action,
            ];
        }

        return view('dashboard.roles.index', [
            'permissionGroups' => $grouped,
        ]);
    }

    public function data(Request $request)
    {
        $query = Role::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%$search%");
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $roles = $query->withCount('permissions')->paginate($request->get('per_page', 10));

        return response()->json([
            'data' => $roles->items(),
            'pagination' => [
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
                'total' => $roles->total(),
                'from' => $roles->firstItem(),
                'to' => $roles->lastItem(),
            ],
        ]);
    }

    public function stats()
    {
        $totalRoles = Role::count();
        $newThisMonth = Role::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'total_roles' => $totalRoles,
            'new_this_month' => $newThisMonth,
        ]);
    }

    public function chartData()
    {
        $data = Role::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }

    public function show(Role $role)
    {
        $role->load('permissions:id,name');
        return response()->json([
            'id' => $role->id,
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('id'),
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'admin',
        ]);

        if ($request->filled('permissions')) {
            $permissionIds = Permission::where('guard_name', $role->guard_name)
                ->whereIn('id', $request->permissions)
                ->pluck('id')
                ->all();
            $role->syncPermissions($permissionIds);
        }

        return response()->json(['message' => 'تم إنشاء الدور بنجاح.']);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->update(['name' => $request->name]);

        $permissionIds = Permission::where('guard_name', $role->guard_name)
            ->whereIn('id', $request->get('permissions', []))
            ->pluck('id')
            ->all();
        $role->syncPermissions($permissionIds);

        return response()->json(['message' => 'تم تحديث الدور بنجاح.']);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'تم حذف الدور بنجاح.']);
    }
}
