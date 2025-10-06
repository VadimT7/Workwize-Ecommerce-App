<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no CSRF protection needed for API)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public product browsing
Route::get('/products', [ProductController::class, 'allProducts']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected routes with Sanctum token authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // Authentication
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Supplier routes
    Route::prefix('supplier')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::get('/purchases', [ProductController::class, 'purchases']);
    });
    
    // Customer routes
    Route::prefix('customer')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
        Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    });
});
