<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    // Upload gambar
    public function uploadImage(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:article_news,id',
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        $path = $request->file('image')->store('public/images');
        $url = Storage::url($path);

        $media = Media::create([
            'article_id' => $request->article_id,
            'media_type' => 'image',
            'url' => $url,
        ]);

        return response()->json($media);
    }

    // Tambah video dengan URL
    public function addVideo(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:article_news,id',
            'url' => 'required|url',
        ]);

        $media = Media::create([
            'article_id' => $request->article_id,
            'media_type' => 'video',
            'url' => $request->url,
        ]);

        return response()->json($media);
    }

    // Optional: List media per artikel
    public function getByArticle($article_id)
    {
        $media = Media::where('article_id', $article_id)->get();
        return response()->json($media);
    }
}
