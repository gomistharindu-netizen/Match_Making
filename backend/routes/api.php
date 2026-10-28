<?php

use App\Http\Controllers\Api\AdminPortalController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

// Public Endpoints
Route::get('/settings', [PublicController::class, 'settings']);
Route::prefix('public')->group(function () {
    Route::get('/settings', [PublicController::class, 'settings']);
    Route::get('/profiles', [PublicController::class, 'profiles']);
    Route::get('/profiles/{code}', [PublicController::class, 'profileDetails']);
    Route::post('/horoscope-orders', [PublicController::class, 'createHoroscopeOrder'])->middleware('throttle:public-submissions');
    Route::get('/horoscope-orders/{code}', [PublicController::class, 'trackHoroscopeOrder']);
});

// Authentication Endpoints (Rate Limited)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:secure-register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:secure-login');
});

// Payment Handlers
Route::post('/payments/bank-slip', [PaymentController::class, 'submitBankSlip'])->middleware('throttle:public-submissions');
Route::post('/payments/payhere-notify', [PaymentController::class, 'payhereNotify']);

// Authenticated Member Endpoints (Requires Sanctum Token + Throttled)
Route::middleware(['auth:sanctum', 'throttle:secure-api'])->group(function () {
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

    // Dedicated React/shadcn Admin Portal API (Enforced by Admin Middleware)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/stats', [AdminPortalController::class, 'stats']);
        Route::get('/profiles', [AdminPortalController::class, 'profiles']);
        Route::put('/profiles/{id}/status', [AdminPortalController::class, 'updateProfileStatus']);
        Route::get('/horoscope-orders', [AdminPortalController::class, 'horoscopeOrders']);
        Route::post('/horoscope-orders/{id}', [AdminPortalController::class, 'updateHoroscopeOrder']);
        Route::get('/bank-slips', [AdminPortalController::class, 'bankSlips']);
        Route::post('/bank-slips/{id}/verify', [AdminPortalController::class, 'verifyBankSlip']);
        Route::get('/settings', [AdminPortalController::class, 'settings']);
        Route::put('/settings', [AdminPortalController::class, 'updateSettings']);
        Route::post('/media/upload', [AdminPortalController::class, 'uploadMedia']);
        Route::get('/users', [AdminPortalController::class, 'users']);
    });
});
