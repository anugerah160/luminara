<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'picture',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Accessor untuk atribut 'picture'.
     * Selalu mengubah path yang tersimpan di DB menjadi URL yang bisa diakses publik.
     */
    protected function picture(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // Jika value adalah path ke gambar default atau null/kosong
                if (!$value || $value === 'default.png') {
                    // Kembalikan path ke gambar default yang ada di frontend/public
                    // Ini adalah fallback jika tidak ada gambar
                    return '/images/default.png';
                }

                // Jika value sudah merupakan URL lengkap (misalnya dari social login)
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value;
                }

                // Jika value adalah path dari storage, buat URL lengkapnya
                // Storage::url() akan menghasilkan /storage/pictures/file.jpg
                return Storage::url($value);
            }
        );
    }
    
    public function articles(): HasMany
    {
        return $this->hasMany(ArticleNews::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}