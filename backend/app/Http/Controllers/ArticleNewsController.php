<?php

namespace App\Http\Controllers;

use App\Models\ArticleNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Import Str untuk menggunakan Str::slug

class ArticleNewsController extends Controller
{
    /**
     * Menampilkan semua artikel dengan filter dan pencarian.
     */
    public function index(Request $request)
    {
        $query = ArticleNews::with(['category', 'author']);

        if ($request->has('q')) {
            $query->where('name', 'like', '%' . $request->q . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return $query->orderByDesc('created_at')->get();
    }

    /**
     * Menampilkan satu artikel berdasarkan ID.
     */
    public function show($id)
    {
        return ArticleNews::with(['category', 'author'])->findOrFail($id);
    }

    /**
     * Menampilkan satu artikel berdasarkan slug.
     */
    public function showBySlug($slug){
        $article = ArticleNews::with(['author:id,name,picture', 'category:id,name', 'comments.user:id,name,picture'])
                        ->where('slug', $slug)
                        ->firstOrFail();

        return response()->json($article);
    }

    /**
     * Menyimpan artikel baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'required|in:yes,no',
        ]);

        $validated['author_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['name']);

        // Simpan thumbnail dan dapatkan path relatifnya (misal: "thumbnails/namafile.jpg")
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path; // Simpan path bersih ini ke database
        }

        $article = ArticleNews::create($validated);
        return response()->json($article, 201);
    }

    /**
     * Memperbarui artikel yang sudah ada di database.
     */
    public function update(Request $request, $id)
    {
        // 1. Temukan artikel berdasarkan ID dari URL
        $articleNews = ArticleNews::findOrFail($id);
        
        // 2. Validasi data yang masuk, sesuaikan dengan nama field dari frontend
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'required|in:yes,no',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Thumbnail opsional saat update
        ]);

        // 3. Update field pada model artikel
        $articleNews->name = $validatedData['name'];
        $articleNews->content = $validatedData['content'];
        $articleNews->category_id = $validatedData['category_id'];
        $articleNews->is_featured = $validatedData['is_featured'];
        $articleNews->slug = Str::slug($validatedData['name']);

        // 4. Logika untuk menangani penggantian thumbnail
        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama jika ada
            $oldThumbnailPath = $articleNews->getRawOriginal('thumbnail');
            if ($oldThumbnailPath && Storage::disk('public')->exists($oldThumbnailPath)) {
                Storage::disk('public')->delete($oldThumbnailPath);
            }

            // Simpan thumbnail baru dan simpan path relatifnya
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $articleNews->thumbnail = $path;
        }

        // 5. Simpan semua perubahan
        $articleNews->save();

        // 6. Kembalikan respon dengan data terbaru
        return response()->json([
            'message' => 'Article updated successfully!',
            'article' => $articleNews->fresh(), // Gunakan fresh() untuk data paling baru
        ]);
    }

    /**
     * Menghapus artikel dari database.
     */
    public function destroy($id)
    {
        $article = ArticleNews::findOrFail($id);

        if ($article->author_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hapus thumbnail dari storage menggunakan path asli
        $thumbnailPath = $article->getRawOriginal('thumbnail');
        if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
            Storage::disk('public')->delete($thumbnailPath);
        }

        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    }

    /**
     * Mendapatkan semua artikel milik penulis yang sedang login.
     */
    public function myArticles()
    {
        $userId = auth()->id();

        $articles = ArticleNews::with('category:id,name')
            ->where('author_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($articles);
    }

    /**
     * Mendapatkan artikel berdasarkan ID penulis.
     */
    public function getArticlesByAuthor($authorId)
    {
        $articles = ArticleNews::with('category:id,name')
            ->where('author_id', $authorId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
    
        return response()->json($articles);
    }
    
    /**
     * Mencari artikel berdasarkan keyword dan filter lainnya.
     */
    public function search(Request $request)
    {
        $keyword = $request->input('q');
        
        $articles = ArticleNews::with('author:id,name', 'category:id,name')
            ->when($keyword, function ($query, $keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                      ->orWhere('content', 'like', "%{$keyword}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    
        return response()->json($articles);
    }
}