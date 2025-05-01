<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'icon' => 'nullable|string',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($name)   // <-- Param ganti jadi $name
    {
        // Cari kategori berdasarkan nama
        $category = Category::where('name', $name)->firstOrFail();

        // Ambil artikel dengan category_id yang sesuai
        $articles = \App\Models\ArticleNews::with('category')
                    ->where('category_id', $category->id)
                    ->latest()
                    ->get();

        return response()->json([
            'category' => $category,
            'articles' => $articles,
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
            'icon' => 'nullable|string',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
