<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class SecureMediaController extends Controller
{
    /**
     * Download or stream securely signed media file
     */
    public function download(Request $request): Response
    {
        // 1. Verify URL cryptographic signature
        if (!$request->hasValidSignature()) {
            return response()->json([
                'message' => 'The secure media link has expired or the signature is invalid. Please refresh the page to generate a new signed URL.',
            ], 403);
        }

        $path = $request->query('path');

        if (!$path) {
            return response()->json(['message' => 'Missing file path'], 400);
        }

        $disk = config('filesystems.default') === 's3' ? 's3' : 'local';

        // Check local disk first, fallback to public disk if legacy file
        if (!Storage::disk($disk)->exists($path) && Storage::disk('public')->exists($path)) {
            $disk = 'public';
        }

        if (!Storage::disk($disk)->exists($path)) {
            return response()->json(['message' => 'Requested file was not found.'], 404);
        }

        $fullPath = Storage::disk($disk)->path($path);
        $mime = Storage::disk($disk)->mimeType($path) ?: 'application/octet-stream';

        return response()->file($fullPath, [
            'Content-Type' => $mime,
            'Cache-Control' => 'private, no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
