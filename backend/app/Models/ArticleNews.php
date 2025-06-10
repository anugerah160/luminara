<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
// Illuminate\Support\Facades\URL; // 'asset()' helper is globally available

class ArticleNews extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name', 'slug', 'thumbnail', 'content',
        'category_id', 'author_id', 'is_featured'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['share_links'];

    /**
     * Boot the model.
     */
    protected static function booted()
    {
        static::creating(function ($article) {
            $article->slug = static::generateUniqueSlug($article->name);
        });

        static::updating(function ($article) {
            if ($article->isDirty('name')) {
                $article->slug = static::generateUniqueSlug($article->name, $article->id);
            }
        });
    }

    /**
     * Generate a unique slug for the article.
     */
    protected static function generateUniqueSlug($name, $ignoreId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)
                    ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                    ->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }

    // =================================================================
    // ## Perubahan Kunci di Sini: Accessor untuk Thumbnail ##
    //
    // Fungsi ini akan secara otomatis mengubah path thumbnail menjadi
    // URL absolut yang bisa diakses oleh frontend.
    // =================================================================
    public function getThumbnailAttribute($value)
    {
        // Jika value sudah merupakan URL lengkap, jangan diubah
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Jika value adalah path (dimulai dengan /storage/),
        // gunakan helper asset() untuk membuat URL lengkap
        return $value ? asset($value) : null;
    }
    
    /**
     * Get the category that owns the article.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Get the author that owns the article.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the comments for the article.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'article_id');
    }
    
    /**
     * Get the media for the article.
     */
    public function media()
    {
        return $this->hasMany(Media::class, 'article_id');
    }

    /**
     * Get the shareable links for the article.
     */
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