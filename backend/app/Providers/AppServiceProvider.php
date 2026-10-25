<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('secure-api', function (Request $request) {
            $actor = $request->user();
            $key = $actor ? 'user:' . $actor->getAuthIdentifier() : 'ip:' . $request->ip();
            return Limit::perMinute(60)->by($key);
        });

        RateLimiter::for('secure-login', function (Request $request) {
            $login = $request->input('login') ?: $request->input('email');
            $login = is_string($login) && strlen($login) <= 254
                ? mb_strtolower(trim($login), 'UTF-8')
                : 'invalid';
            $key = hash_hmac('sha256', $login . '|' . $request->ip(), config('app.key'));
            return [
                Limit::perMinute(20)->by('ip:' . $request->ip()),
                Limit::perMinute(5)->by('identity-ip:' . $key),
            ];
        });

        RateLimiter::for('secure-register', function (Request $request) {
            return Limit::perMinute(5)->by('ip:' . $request->ip());
        });

        RateLimiter::for('public-submissions', function (Request $request) {
            return Limit::perMinute(10)->by('ip:' . $request->ip());
        });
    }
}
