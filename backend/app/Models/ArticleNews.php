<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleNews extends Model
{
    public function category() {
        return $this->belongsTo(Category::class);
    }
    
    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }
    
    public function comments() {
        return $this->hasMany(Comment::class);
    }
    
    public function media() {
        return $this->hasMany(Media::class);
    }
    
}
