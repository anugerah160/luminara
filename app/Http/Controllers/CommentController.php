<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Menampilkan komentar untuk artikel tertentu
    public function index($article_id)
    {
        $comments = Comment::with('user:id,name')->where('article_id', $article_id)->latest()->get();
        return response()->json($comments);
    }

    // Menambahkan komentar (hanya user terautentikasi)
    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:article_news,id',
            'comment' => 'required|string',
        ]);

        $comment = Comment::create([
            'article_id' => $request->article_id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return response()->json($comment, 201);
    }
}
