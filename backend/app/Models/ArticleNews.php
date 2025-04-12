<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;

class ArticleNews extends Model
{
    protected $fillable = [
        'name', 'slug', 'thumbnail', 'content', 'video',
        'category_id', 'author_id', 'is_featured'
    ];

    protected static function booted()
    {
        static::creating(function ($article) {
            $article->slug = Str::slug($article->name);
        });

        static::updating(function ($article) {
            $article->slug = Str::slug($article->name);
        });
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function comments()
    {
        return $this->hasMany(Comment::class, 'article_id');
    }
    
    public function media(){
        return $this->hasMany(Media::class, 'article_id');
    }

    public function getShareLinksAttribute()
    {
        $url = url('/artikel/' . $this->slug); // frontend URL

        return [
            'whatsapp' => 'https://wa.me/?text=' . urlencode($this->name . ' ' . $url),
            'facebook' => 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode($url),
            'twitter'  => 'https://twitter.com/intent/tweet?url=' . urlencode($url) . '&text=' . urlencode($this->name),
            'linkedin' => 'https://www.linkedin.com/sharing/share-offsite/?url=' . urlencode($url),
        ];
    }
}

