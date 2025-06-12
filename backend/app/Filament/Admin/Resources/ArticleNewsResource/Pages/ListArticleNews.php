<?php

namespace App\Filament\Admin\Resources\ArticleNewsResource\Pages;

use App\Filament\Admin\Resources\ArticleNewsResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListArticleNews extends ListRecords
{
    protected static string $resource = ArticleNewsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
