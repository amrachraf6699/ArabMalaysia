<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreAdminRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminsController extends Controller
{
    public function index()
    {
        return view('dashboard.admins.index');
    }

    // جلب بيانات الجدول (Ajax)
    public function data(Request $request)
    {
        $query = Admin::where('id', '!=', auth()->id());

        // البحث
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            });
        }

        // التاريخ
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $admins = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'data' => $admins->items(),
            'pagination' => [
                'current_page' => $admins->currentPage(),
                'last_page' => $admins->lastPage(),
                'total' => $admins->total(),
                'from' => $admins->firstItem(),
                'to' => $admins->lastItem(),
            ]
        ]);
    }

    public function stats()
    {
        $totalAdmins = Admin::count();
        $newThisMonth = Admin::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'total_admins' => $totalAdmins,
            'new_this_month' => $newThisMonth,
        ]);
    }

    // بيانات الرسم البياني - المسؤولين المضافين خلال آخر 30 يوم
    public function chartData()
    {
        $data = Admin::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($data);
    }

    public function show(Admin $admin)
    {
        return response()->json($admin);
    }

    public function store(StoreAdminRequest $request)
    {
        Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
        ]);

        return response()->json(['message' => 'تم إضافة المسؤول بنجاح']);
    }

    public function update(Request $request, Admin $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'password' => 'nullable|min:8',
            'phone' => 'nullable|string|max:20',
        ]);

        $data = $request->only(['name', 'email', 'phone']);
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $admin->update($data);

        return response()->json(['message' => 'تم التعديل بنجاح']);
    }

    public function destroy(Admin $admin)
    {
        if ($admin->id === auth()->id()) {
            return response()->json(['message' => 'لا يمكن حذف حسابك الشخصي!'], 403);
        }

        $admin->delete();
        return response()->json(['message' => 'تم الحذف بنجاح']);
    }
}
