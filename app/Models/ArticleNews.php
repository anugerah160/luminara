<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleNews extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'content',
        'category_id',
        'author_id',
        'is_featured'
    ];
    
    protected $appends = ['share_links'];

    /**
     * Relationship with Category.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship with User (Author).
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Relationship with Comment.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'article_id');
    }

    protected function thumbnail(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) {
                    return null; // Mengembalikan null jika tidak ada thumbnail
                }

                // Cek apakah nilai sudah merupakan URL lengkap
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value; // Jika ya, kembalikan langsung URL tersebut
                }

                // Jika tidak, asumsikan itu adalah path storage lokal dan buat URL-nya
                return Storage::disk('public')->url($value);
            }
        );
    }
    
    public function getShareLinksAttribute(): array
    {
        // Ambil URL frontend dari .env, jika tidak ada gunakan localhost:5173 sebagai default
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
        $articleUrl = $frontendUrl . '/articles/' . $this->slug;
        $encodedUrl = urlencode($articleUrl);
        $encodedTitle = urlencode($this->name);

        return [
            'whatsapp' => "https://wa.me/?text={$encodedTitle}+{$encodedUrl}",
            'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$encodedUrl}",
            'twitter' => "https://twitter.com/intent/tweet?url={$encodedUrl}&text={$encodedTitle}",
            'linkedin' => "https://www.linkedin.com/sharing/share-offsite/?url={$encodedUrl}",
        ];
    }
}