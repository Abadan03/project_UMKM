<?php

namespace Database\Seeders;

use App\Models\T_Roles;
use App\Models\T_Staff;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles & permissions
        // app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // MAKE ROLES

        // $makeRoles = T_Roles::create(['name' => 'super admin', 'name' => 'admin', 'name' => 'staff']);

        // =====================
        // Buat Roles
        // =====================
        $superAdminRole = T_Roles::firstOrCreate(['name' => 'super admin']);
        $adminRole = T_Roles::firstOrCreate(['name' => 'admin']);
        $staffRole = T_Roles::firstOrCreate(['name' => 'staff']);

        // =====================
        // Buat Super Admin
        // =====================
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@umkm.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'roles_id' => $superAdminRole->id
            ]
        );
        // $superAdmin->assignRole($superAdminRole);

        // =====================
        // Buat Admin
        // =====================
        $admin = User::firstOrCreate(
            ['email' => 'admin@umkm.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'roles_id' => $adminRole->id
            ]
        );
        // $admin->assignRole($adminRole);

        // =====================
        // Buat Staff
        // =====================
        $staff = User::firstOrCreate(
            ['email' => 'staff@umkm.com'],
            [
                'name' => 'Staff Toko',
                // 'password' => Hash::make('password'),
                'password' => bcrypt('password'),
                'roles_id' => $staffRole->id
            ]
        );
        // $staff->assignRole($staffRole);

        // seed staff manage
        T_Staff::firstOrCreate(['name' => "user", "pin" => 1234, "users_id" => 1, "roles_id" => $staffRole->id]);
    }
}
