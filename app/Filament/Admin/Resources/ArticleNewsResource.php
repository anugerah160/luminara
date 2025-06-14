<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\ArticleNewsResource\Pages;
use App\Models\ArticleNews;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ArticleNewsResource extends Resource
{
    protected static ?string $model = ArticleNews::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Main Content')->schema([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn(Set $set, ?string $state) => $set('slug', Str::slug($state))),
                    TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(ArticleNews::class, 'slug', ignoreRecord: true),
                    RichEditor::make('content')
                        ->required()
                        ->columnSpanFull(),
                ])->columns(2),

                Section::make('Meta')->schema([
                    FileUpload::make('image_path')
                        ->label('Image')
                        ->image()
                        ->directory('articles'),
                    Toggle::make('is_published')
                        ->label('Published')
                        ->default(true),
                    Select::make('category_id')
                        ->relationship('category', 'name')
                        ->required(),
                    Select::make('user_id')
                        ->label('Author')
                        ->relationship('user', 'name')
                        ->required()
                        ->default(auth()->id()),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                ImageColumn::make('image_path')->label('Image'),
                TextColumn::make('title')->searchable()->limit(30),
                TextColumn::make('category.name')->sortable(),
                IconColumn::make('is_published')->boolean(),
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
            'create' => Pages\CreateArticleNews::route('/create'),
            'edit' => Pages\EditArticleNews::route('/{record}/edit'),
        ];
    }
}
