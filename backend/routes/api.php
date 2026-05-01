<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\StudentAuthController;
use App\Http\Controllers\Api\V1\Auth\CompanyAuthController;
use App\Http\Controllers\Api\V1\Auth\AdminAuthController;

Route::prefix('v1')->group(function () {
    // Public Auth Routes
    Route::prefix('auth')->group(function () {
        Route::prefix('student')->group(function () {
            Route::post('/register', [StudentAuthController::class, 'register']);
            Route::post('/login', [StudentAuthController::class, 'login']);
        });

        Route::prefix('company')->group(function () {
            Route::post('/register', [CompanyAuthController::class, 'register']);
            Route::post('/login', [CompanyAuthController::class, 'login']);
        });

        Route::prefix('admin')->group(function () {
            Route::post('/login', [AdminAuthController::class, 'login']);
        });
    });

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', function (Request $request) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        });

        Route::get('/user', function (Request $request) {
            return $request->user();
        });
    });
});
