<?php

namespace App\Models;

use App\Enums\UserRole;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'picture', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    protected function picture(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value || $value === 'default.png') {
                    return asset('images/default.png');
                }
                if (filter_var($value, FILTER_VALIDATE_URL)) {
                    return $value;
                }
                if (str_starts_with($value, '/storage/')) {
                    return asset($value);
                }
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