<?php

namespace App\Filament\Admin\Widgets;

use App\Filament\Admin\Resources\CommentResource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Comment;

class LatestComments extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(CommentResource::getEloquentQuery())
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('article.name')
                    ->label('Article')
                    ->limit(30),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User'),
                Tables\Columns\TextColumn::make('comment')
                    ->limit(50)
                    ->wrap(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->url(fn (Comment $record): string => CommentResource::getUrl('index', ['tableSearch' => $record->id]))
                    ->icon('heroicon-m-eye'),
            ]);
    }
}
