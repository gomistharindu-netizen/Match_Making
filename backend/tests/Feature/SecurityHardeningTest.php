<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that non-admin member is blocked by Admin Middleware with 403 Forbidden
     */
    public function test_non_admin_member_cannot_access_admin_portal_api(): void
    {
        $member = User::where('role', 'member')->first() ?? User::factory()->create(['role' => 'member']);

        $response = $this->actingAs($member, 'sanctum')->getJson('/api/admin/stats');

        $response->assertStatus(403);
    }

    /**
     * Test that forged PayHere IPN notification with invalid signature is rejected with 400 Bad Request
     */
    public function test_forged_payhere_ipn_signature_is_rejected(): void
    {
        config(['services.payhere.merchant_secret' => 'test_secret_key_12345']);

        $response = $this->postJson('/api/payments/payhere-notify', [
            'merchant_id' => '1211143',
            'order_id' => 'NON_EXISTENT_ORDER',
            'payhere_amount' => '3500.00',
            'payhere_currency' => 'LKR',
            'status_code' => '2',
            'md5sig' => 'FORGED_INVALID_SIGNATURE',
        ]);

        $response->assertStatus(400);
    }

    /**
     * Test that user without a profile receives 400 Bad Request instead of 500 server crash
     */
    public function test_user_without_profile_cannot_access_chat_messages_without_crash(): void
    {
        $userWithoutProfile = User::factory()->create([
            'role' => 'member',
            'account_status' => 'active',
        ]);

        $response = $this->actingAs($userWithoutProfile, 'sanctum')->getJson('/api/member/conversations/1/messages');

        $response->assertStatus(400);
        $response->assertJson(['message' => 'Member profile required to access messages']);
    }

    /**
     * Test that repeated failed login attempts are throttled with 429 Too Many Requests
     */
    public function test_repeated_login_attempts_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', [
                'login' => 'attacker@example.com',
                'password' => 'wrong_password',
            ]);
        }

        // 6th attempt within the minute should trigger 429
        $response = $this->postJson('/api/auth/login', [
            'login' => 'attacker@example.com',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(429);
    }
}
