<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ArticleNewsController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{name}', [CategoryController::class, 'show']);

Route::get('/articles', [ArticleNewsController::class, 'index']);
Route::get('/articles/search', [ArticleNewsController::class, 'search']);
Route::get('/articles/{slug}', [ArticleNewsController::class, 'showBySlug']);
Route::get('/authors/{authorId}', [ArticleNewsController::class, 'getArticlesByAuthor']);
Route::get('/topauthors', [UserController::class, 'topAuthors']);
Route::get('/comments/{article_id}', [CommentController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated User
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Categories (Admin/Editor only)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Articles
    Route::get('/my-articles', [ArticleNewsController::class, 'myArticles']);
    Route::post('/articles', [ArticleNewsController::class, 'store']);
    Route::post('/articles/{id}', [ArticleNewsController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleNewsController::class, 'destroy']);

    // Users (Admin only)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::post('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Media
    Route::post('/media/image', [MediaController::class, 'uploadImage']);
    Route::post('/media/video', [MediaController::class, 'addVideo']);
    Route::get('/media/article/{article_id}', [MediaController::class, 'getByArticle']);

    // Comments
    Route::post('/comments', [CommentController::class, 'store']);
});
