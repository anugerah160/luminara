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

    protected $fillable = ['name', 'email', 'password', 'picture'];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    /**
     * FINAL REVISION: Accessor for the 'picture' attribute.
     * This logic now correctly handles all path variations.
     */
    protected function picture(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // 1. Handle null or default values.
                if (!$value || $value === 'default.png') {
                    return asset('images/default.png');
                }

                // 2. Handle if the value is already a full URL.
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value;
                }
                
                // 3. IMPORTANT FIX: If the path from the database ALREADY starts
                // with '/storage/', just prepend the base URL with asset().
                // This prevents the double '/storage//storage/' issue.
                if (str_starts_with($value, '/storage/')) {
                    return asset($value);
                }

                // 4. For standard paths like 'public/pictures/file.jpg',
                // convert it to a full URL.
                return asset(Storage::url($value));
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