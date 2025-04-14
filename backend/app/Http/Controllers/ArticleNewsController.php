<?php

namespace App\Http\Controllers;

use App\Models\ArticleNews;
use Illuminate\Http\Request;

class ArticleNewsController extends Controller
{
    public function index(Request $request)
    {
        $query = ArticleNews::with(['category', 'author']);

        // Search
        if ($request->has('q')) {
            $query->where('name', 'like', '%' . $request->q . '%');
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function show($id)
    {
        return ArticleNews::with(['category', 'author'])->findOrFail($id);
    }

    public function showBySlug($slug){
        $article = ArticleNews::with(['author:id,name', 'category:id,name', 'comments.user:id,name'])
                    ->where('slug', $slug)
                    ->firstOrFail();

        return response()->json($article->append('share_links'));
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'thumbnail' => 'nullable|string',
            'content' => 'required|string',
            'video' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'in:yes,no',
        ]);

        $validated['author_id'] = auth()->id();

        $article = ArticleNews::create($validated);
        return response()->json($article, 201);
    }

    public function update(Request $request, $id)
    {
        $article = ArticleNews::findOrFail($id);

        if ($article->author_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'thumbnail' => 'nullable|string',
            'content' => 'required|string',
            'video' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'in:yes,no',
        ]);

        $article->update($validated);
        return response()->json($article);
    }

    public function destroy($id)
    {
        $article = ArticleNews::findOrFail($id);

        if ($article->author_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $article->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function getArticlesByAuthor($authorId)
    {
        $articles = ArticleNews::with('category:id,name')
            ->where('author_id', $authorId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
    
        return response()->json($articles);
    }

    public function search(Request $request)
    {
        $keyword = $request->input('q');
        $authorName = $request->input('author');
        $categoryName = $request->input('category');
        $sort = $request->input('sort'); // 'latest', 'oldest'
    
        $articles = ArticleNews::with('author:id,name', 'category:id,name')
            ->when($keyword, function ($query, $keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('name', 'like', "%{$keyword}%")
                      ->orWhere('content', 'like', "%{$keyword}%")
                      ->orWhereHas('category', function ($q2) use ($keyword) {
                          $q2->where('name', 'like', "%{$keyword}%");
                      });
                });
            })
            ->when($authorName, function ($query, $authorName) {
                $query->whereHas('author', function ($q) use ($authorName) {
                    $q->where('name', 'like', "%{$authorName}%");
                });
            })
            ->when($categoryName, function ($query, $categoryName) {
                $query->whereHas('category', function ($q) use ($categoryName) {
                    $q->where('name', 'like', "%{$categoryName}%");
                });
            })
            ->when($sort === 'oldest', function ($q) {
                $q->orderBy('created_at', 'asc');
            }, function ($q) {
                $q->orderBy('created_at', 'desc'); // default: latest
            })
            ->paginate(10);
    
        return response()->json($articles);
    }
    
    
    
}
