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
        User::truncate();

        for ($i = 1; $i <= 30; $i++) {
            User::FirstOrCreate([
                'name'     => 'user' . $i,
                'email'    => 'user' . $i . '@website.com',
                'password' => 'password' . $i,
                'phone'    => $i % 2 == 0 ? $faker->e164PhoneNumber() : null,
                'created_at' => $faker->dateTimeBetween('-30 days', 'now'),
                'updated_at' => $faker->dateTimeBetween('-30 days', 'now'),
            ]);
        }
    }
}
