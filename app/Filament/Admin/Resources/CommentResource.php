<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\CommentResource\Pages;
use App\Models\Comment;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class CommentResource extends Resource
{
    protected static ?string $model = Comment::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';

    protected static ?int $navigationSort = 3;

    public static function isGloballySearchable(): bool
    {
        return true;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),

                TextColumn::make('article.name')
                    ->label('Article Title')
                    ->searchable()
                    ->sortable()
                    ->limit(40),

                TextColumn::make('comment')
                    ->label('Comment')
                    ->searchable() 
                    ->limit(60)
                    ->wrap(),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Commented At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListComments::route('/'),
        ];
    }
}
