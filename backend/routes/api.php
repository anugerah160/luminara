<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ArticleNewsController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\CommentController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::post('/articles', [ArticleNewsController::class, 'store']);
    Route::put('/articles/{id}', [ArticleNewsController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleNewsController::class, 'destroy']);
    Route::post('/media/image', [MediaController::class, 'uploadImage']);
    Route::post('/media/video', [MediaController::class, 'addVideo']);
    Route::get('/media/article/{article_id}', [MediaController::class, 'getByArticle']);
    Route::post('/comments', [CommentController::class, 'store']);
});

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/articles', [ArticleNewsController::class, 'index']);
Route::get('/articles/search', [ArticleNewsController::class, 'search']);
Route::get('/articles/{slug}', [ArticleNewsController::class, 'showBySlug']);
Route::get('/authors/{authorId}', [ArticleNewsController::class, 'getArticlesByAuthor']);
// Route::get('/articles/{id}', [ArticleNewsController::class, 'show']);
Route::get('/comments/{article_id}', [CommentController::class, 'index']);