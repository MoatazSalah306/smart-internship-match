<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\StudentAuthController;
use App\Http\Controllers\Api\V1\Auth\CompanyAuthController;
use App\Http\Controllers\Api\V1\Auth\AdminAuthController;
use App\Http\Controllers\Api\V1\InternshipController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\StudentProfileController;
use App\Http\Controllers\Api\V1\AdminDashboardController;

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

    // Public Internship Routes
    Route::get('/internships', [InternshipController::class, 'index']);
    Route::get('/internships/{internship}', [InternshipController::class, 'show']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', function (Request $request) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        });

        Route::get('/auth/me', function (Request $request) {
            $user = $request->user();
            $profile = null;
            if ($user->role === 'student') {
                $profile = $user->student;
            } elseif ($user->role === 'company') {
                $profile = $user->company;
            }
            return response()->json([
                'user' => $user,
                'profile' => $profile
            ]);
        });

        // Internship Management (Company)
        Route::get('/company/internships', [InternshipController::class, 'myInternships']);
        Route::get('/company/internships/{id}/applications', [InternshipController::class, 'applicants']);
        Route::post('/company/internships', [InternshipController::class, 'store']);
        Route::put('/company/internships/{internship}', [InternshipController::class, 'update']);
        Route::delete('/company/internships/{internship}', [InternshipController::class, 'destroy']);
        Route::post('/company/internships/{internship}/archive', [InternshipController::class, 'destroy']); // since frontend has /archive mapping to soft delete
        Route::post('/company/internships/{id}/restore', [InternshipController::class, 'restore']);

        // Student Profile
        Route::get('/student/profile', [StudentProfileController::class, 'show']);
        Route::put('/student/profile', [StudentProfileController::class, 'update']);
        Route::post('/student/profile/cv', [StudentProfileController::class, 'uploadCv']);
        Route::delete('/student/profile/cv', [StudentProfileController::class, 'deleteCv']);

        // Company Profile
        Route::get('/company/profile', [\App\Http\Controllers\Api\V1\CompanyProfileController::class, 'show']);
        Route::put('/company/profile', [\App\Http\Controllers\Api\V1\CompanyProfileController::class, 'update']);

        // Applications
        Route::get('/student/applications', [ApplicationController::class, 'index']); // For student my applications
        Route::get('/company/applications', [ApplicationController::class, 'index']); // For company
        Route::get('/applications', [ApplicationController::class, 'index']); // general
        Route::post('/internships/{internship_id}/apply', [ApplicationController::class, 'store']);
        Route::put('/company/applications/{application}', [ApplicationController::class, 'update']);
        Route::patch('/company/applications/{application}', [ApplicationController::class, 'update']); // since frontend uses PATCH
        Route::delete('/student/applications/{application}', [ApplicationController::class, 'destroy']);

        // Admin
        Route::get('/admin/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/admin/students', [AdminDashboardController::class, 'students']);
        Route::get('/admin/companies', [AdminDashboardController::class, 'companies']);
        Route::get('/admin/internships', [AdminDashboardController::class, 'internships']);
    });
});
