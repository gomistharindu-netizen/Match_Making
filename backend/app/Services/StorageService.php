<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class StorageService
{
    /**
     * Store a sensitive file in private storage
     */
    public function storeSecure(UploadedFile $file, string $folder = 'secure'): string
    {
        $disk = config('filesystems.default') === 's3' ? 's3' : 'local';

        // Store file securely
        return $file->store($folder, $disk);
    }

    /**
     * Generate an expiring signed URL (default 15 minutes) for a secure file
     */
    public function getExpiringUrl(string $filePath, int $minutes = 15): string
    {
        if (str_starts_with($filePath, 'http://') || str_starts_with($filePath, 'https://')) {
            return $filePath;
        }

        // If AWS S3 or Cloudflare R2 is configured
        if (config('filesystems.default') === 's3' || config('filesystems.disks.s3.key')) {
            try {
                return Storage::disk('s3')->temporaryUrl(
                    $filePath,
                    now()->addMinutes($minutes)
                );
            } catch (\Exception $e) {
                // Fallback to local signed URL
            }
        }

        // Standard Laravel cryptographically signed temporary URL (HMAC-SHA256)
        return URL::temporarySignedRoute(
            'secure-media.download',
            now()->addMinutes($minutes),
            ['path' => $filePath]
        );
    }
}
