<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 30; $i++) {
            Admin::create([
                'name'     => 'Admin' . $i,
                'email'    => 'admin' . $i . '@website.com',
                'password' => 'password' . $i,
                'phone'    => $i % 2 == 0 ? $faker->e164PhoneNumber() : null,
            ]);
        }
    }
}
