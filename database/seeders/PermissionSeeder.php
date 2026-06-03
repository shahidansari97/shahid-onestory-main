<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::firstOrCreate(['name' => 'create']);
        Permission::firstOrCreate(['name' => 'edit']);
        Permission::firstOrCreate(['name' => 'delete']);
        Permission::firstOrCreate(['name' => 'read']);
        Permission::firstOrCreate(['name' => 'dashboard access']);

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $creatorRole = Role::firstOrCreate(['name' => 'creator']);

        $adminRole->givePermissionTo(['create', 'edit', 'delete', 'read', 'dashboard access']);
        $userRole->givePermissionTo(['create', 'edit', 'delete', 'read']);
        $creatorRole->givePermissionTo(['create', 'edit', 'delete', 'read']);

        $admin1 = User::where('email', 'admin1@one-story.com')->first();
        $admin2 = User::where('email', 'admin2@one-story.com')->first();
        $admin3 = User::where('email', 'admin3@one-story.com')->first();
        $admin4 = User::where('email', 'admin4@one-story.com')->first();

        if ($admin1) $admin1->assignRole($adminRole);
        if ($admin2) $admin2->assignRole($adminRole);
        if ($admin3) $admin3->assignRole($adminRole);
        if ($admin4) $admin4->assignRole($adminRole);
    }
}
