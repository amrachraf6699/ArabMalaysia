<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        for ($i = 1; $i <= 30; $i++) {
            User::create([
                'name'     => 'Admin' . $i,
                'email'    => 'admin' . $i . '@website.com',
                'password' => 'password' . $i,
                'phone'    => $i % 2 == 0 ? $faker->e164PhoneNumber() : null,
            ]);
        }
    }
}
