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
            ['name' => 'Berita Terkini', 'slug' => 'berita-terkini', 'icon' => 'FaNewspaper'],
            ['name' => 'Olahraga', 'slug' => 'olahraga', 'icon' => 'FaFutbol'],
            ['name' => 'Teknologi', 'slug' => 'teknologi', 'icon' => 'FaLaptopCode'],
            ['name' => 'Hiburan', 'slug' => 'hiburan', 'icon' => 'FaFilm'],
            ['name' => 'Gaya Hidup', 'slug' => 'gaya-hidup', 'icon' => 'FaHeart'],
            ['name' => 'Politik', 'slug' => 'politik', 'icon' => 'FaLandmark'],
            ['name' => 'Bisnis', 'slug' => 'bisnis', 'icon' => 'FaBriefcase'],
            ['name' => 'Kuliner', 'slug' => 'kuliner', 'icon' => 'FaUtensils'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}