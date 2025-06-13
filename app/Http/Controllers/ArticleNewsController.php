<?php

namespace App\Http\Controllers;

use App\Models\ArticleNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        // Tambahkan filter untuk artikel unggulan
        if ($request->has('is_featured') && $request->is_featured === 'yes') {
            $query->where('is_featured', 'yes');
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
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'required|in:yes,no',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Untuk file upload
            'thumbnail_url' => 'nullable|url|max:2048', // Untuk URL eksternal
        ]);

        $validated['author_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $path;
        } elseif ($request->filled('thumbnail_url')) {
            $validated['thumbnail'] = $request->thumbnail_url;
        } else {
            $validated['thumbnail'] = null;
        }
        
        unset($validated['thumbnail_url']); 

        $article = ArticleNews::create($validated);
        return response()->json($article, 201);
    }

    /**
     * Memperbarui artikel yang sudah ada di database.
     */
    public function update(Request $request, $id)
    {
        $articleNews = ArticleNews::findOrFail($id);
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'required|in:yes,no',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'thumbnail_url' => 'nullable|url|max:2048',
            'should_remove_thumbnail' => 'nullable|boolean',
        ]);

        $articleNews->name = $validatedData['name'];
        $articleNews->content = $validatedData['content'];
        $articleNews->category_id = $validatedData['category_id'];
        $articleNews->is_featured = $validatedData['is_featured'];
        $articleNews->slug = Str::slug($validatedData['name']);

        $oldThumbnailPath = $articleNews->getRawOriginal('thumbnail');
        $isOldThumbnailExternalUrl = filter_var($oldThumbnailPath, FILTER_VALIDATE_URL);

        if ($request->hasFile('thumbnail')) {
            if ($oldThumbnailPath && !$isOldThumbnailExternalUrl && Storage::disk('public')->exists($oldThumbnailPath)) {
                Storage::disk('public')->delete($oldThumbnailPath);
            }
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $articleNews->thumbnail = $path;
        } 
        elseif ($request->filled('thumbnail_url')) {
            if ($oldThumbnailPath && !$isOldThumbnailExternalUrl && Storage::disk('public')->exists($oldThumbnailPath)) {
                Storage::disk('public')->delete($oldThumbnailPath);
            }
            $articleNews->thumbnail = $request->thumbnail_url;
        } 
        elseif ($request->boolean('should_remove_thumbnail')) {
            if ($oldThumbnailPath && !$isOldThumbnailExternalUrl && Storage::disk('public')->exists($oldThumbnailPath)) {
                Storage::disk('public')->delete($oldThumbnailPath);
            }
            $articleNews->thumbnail = null;
        }

        $articleNews->save();

        return response()->json([
            'message' => 'Article updated successfully!',
            'article' => $articleNews->fresh(),
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

        $thumbnailPath = $article->getRawOriginal('thumbnail');
        if ($thumbnailPath && !filter_var($thumbnailPath, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($thumbnailPath)) {
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