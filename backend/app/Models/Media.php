<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'media_type',
        'url',
    ];

    public function article()
    {
        return $this->belongsTo(ArticleNews::class, 'article_id');
    }
}

