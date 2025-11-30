<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = ['admins', 'users', 'roles'];
        $actions = ['create', 'read', 'update', 'delete'];
        $guard = 'admin';

        $permissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $name = "{$resource}_{$action}";
                $permissions[] = Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => $guard]
                );
            }
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => $guard]);
        $superAdmin->syncPermissions($permissions);

        Admin::all()->each(function ($admin) use ($superAdmin) {
            $admin->syncRoles([$superAdmin]);
        });
    }
}
