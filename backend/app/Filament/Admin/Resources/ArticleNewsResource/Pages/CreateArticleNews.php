<?php

namespace App\Filament\Admin\Resources\ArticleNewsResource\Pages;

use App\Filament\Admin\Resources\ArticleNewsResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateArticleNews extends CreateRecord
{
    protected static string $resource = ArticleNewsResource::class;
}
