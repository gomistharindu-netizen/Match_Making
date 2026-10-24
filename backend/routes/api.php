<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

// Public Endpoints
Route::prefix('public')->group(function () {
    Route::get('/settings', [PublicController::class, 'settings']);
    Route::get('/profiles', [PublicController::class, 'profiles']);
    Route::get('/profiles/{code}', [PublicController::class, 'profileDetails']);
    Route::post('/horoscope-orders', [PublicController::class, 'createHoroscopeOrder']);
    Route::get('/horoscope-orders/{code}', [PublicController::class, 'trackHoroscopeOrder']);
});

// Authentication Endpoints
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Payment Handlers
Route::post('/payments/bank-slip', [PaymentController::class, 'submitBankSlip']);
Route::post('/payments/payhere-notify', [PaymentController::class, 'payhereNotify']);

// Authenticated Member Endpoints (Requires Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profile Management & Viewer Tracking
    Route::prefix('member')->group(function () {
        Route::put('/profile', [MemberController::class, 'updateProfile']);
        Route::post('/photo', [MemberController::class, 'uploadPhoto']);
        Route::delete('/photo/{id}', [MemberController::class, 'deletePhoto']);
        Route::post('/viewed/{profileCode}', [MemberController::class, 'recordView']);
        Route::get('/recently-viewed', [MemberController::class, 'recentlyViewed']);
        Route::get('/who-viewed-me', [MemberController::class, 'whoViewedMe']);

        // Chat & Interests
        Route::get('/conversations', [ChatController::class, 'conversations']);
        Route::get('/conversations/{id}/messages', [ChatController::class, 'messages']);
        Route::post('/conversations/{id}/messages', [ChatController::class, 'sendMessage']);
        Route::post('/conversations/{id}/grant-contact', [ChatController::class, 'grantContact']);
        Route::post('/interests', [ChatController::class, 'sendInterest']);
        Route::put('/interests/{id}/respond', [ChatController::class, 'respondInterest']);
    });
});
