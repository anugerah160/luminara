<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => 'FaFutbol'],
            ['name' => 'Politics', 'slug' => 'politics', 'icon' => 'FaLandmark'],
            ['name' => 'Economy', 'slug' => 'economy', 'icon' => 'FaBriefcase'],
            ['name' => 'Technology', 'slug' => 'technology', 'icon' => 'FaLaptopCode'],
            ['name' => 'Entertainment', 'slug' => 'entertainment', 'icon' => 'FaFilm'],
            ['name' => 'Health', 'slug' => 'health', 'icon' => 'FaHeartbeat'],
            ['name' => 'Education', 'slug' => 'education', 'icon' => 'FaUserGraduate'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
