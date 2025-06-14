<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\ArticleNewsResource\Pages;
use App\Models\ArticleNews;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Forms\Form;

class ArticleNewsResource extends Resource
{
    protected static ?string $model = ArticleNews::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Article Management')->schema([
                    TextInput::make('name')
                        ->label('Article Title')
                        ->required()
                        ->disabled(),
                    
                    Select::make('category_id')
                        ->relationship('category', 'name')
                        ->required(),
                    
                    // --- PERBAIKAN ERROR ---
                    // Mengganti nama relasi dari 'user' menjadi 'author' agar sesuai dengan model
                    Select::make('author_id')
                        ->label('Author')
                        ->relationship('author', 'name')
                        ->disabled(),

                    Select::make('is_featured')
                        ->label('Featured Article?')
                        ->options([
                            'yes' => 'Yes',
                            'no' => 'No',
                        ])
                        ->required(),

                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                ImageColumn::make('thumbnail')->label('Image'),
                TextColumn::make('name')->label('Title')->searchable()->limit(30),
                TextColumn::make('category.name')->sortable(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->icon(fn (string $state): string => match ($state) {
                        'yes' => 'heroicon-o-star',
                        default => '',
                    })
                    ->color('warning'),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    /**
     * Menonaktifkan tombol dan halaman "Create"
     */
    public static function canCreate(): bool
    {
        return false;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticleNews::route('/'),
            'edit' => Pages\EditArticleNews::route('/{record}/edit'),
        ];
    }
}
