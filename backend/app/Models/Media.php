<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    public function article() {
        return $this->belongsTo(ArticleNews::class);
    }    
}
