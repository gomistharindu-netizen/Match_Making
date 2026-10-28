---
name: secure-laravel-php
description: Explain, review, and fix Laravel and PHP vulnerabilities including SQL injection, XSS, CSRF, broken authorization, mass assignment, unsafe uploads, RCE, SSRF, sessions, secrets, and vulnerable dependencies. Use for Laravel/PHP security questions, code audits, secure feature development, production hardening, or verified CVE remediation. Explain in Sinhala with familiar English technical terms unless the user prefers another language.
---

# Secure Laravel and PHP

## Purpose

Explain vulnerabilities and implement protections in Laravel or plain PHP. Use simple Sinhala with English technical terms; keep code and identifiers in English. For each relevant issue explain **මොකක්ද → හානිය මොකක්ද → protect වෙන්නේ කොහොමද → verify කරන්නේ කොහොමද**.

Distinguish application coding mistakes, framework/package flaws, and PHP runtime/server flaws. Do not imply every application has every issue or that a Laravel upgrade fixes PHP runtime vulnerabilities. Framework defaults protect only the code paths that use them correctly.

Use the official references below. Source review date: **2026-10-25**. Recheck changing information; do not treat this file as a permanent list of current CVEs.

## 1. Establish facts

1. Read project instructions, `composer.json`, `composer.lock`, relevant routes, middleware, models, policies, controllers, Form Requests, views and deployment configuration. Never dump `.env`, credentials, session contents or private records.
2. Identify exact Laravel/PHP/Composer/package versions and platform requirements. Prefer lockfile versions. Match code to the installed framework major version; do not blindly copy the newest API.
3. Identify session versus bearer authentication, SPA/Sanctum versus server rendering, roles, tenants, uploads, sensitive records and outbound requests. Trace external input through authorization to database, templates, files, processes and network sinks.
4. Without a supplied project, provide educational guidance and labelled examples. Never claim to audit unseen code.
5. Before running Artisan/tests, confirm a trusted checkout and isolated development/test services: these commands execute application code and may mutate databases or contact external services.

Use relevant inspection commands, adapting to installed tooling:

```text
php -v
php --ini
composer --version
composer show laravel/framework
composer audit --locked --format=json
php artisan --version
php artisan route:list
```

Check `composer audit --help` if flags differ. Report unavailable/network-blocked checks as incomplete. A clean audit does not prove application security. CLI PHP can differ from FPM, Apache, IIS, containers or hosting-panel PHP: verify the actual web-serving build/configuration and required worker restarts separately. Never create a publicly accessible `phpinfo()` page. [1–3]

## 2. Match vulnerabilities with protection

Use the table as a selection checklist, not evidence that every item has been tested.

| Vulnerability | සරල අදහස / impact | Laravel protection | Plain PHP / server protection | Verify |
| --- | --- | --- | --- | --- |
| SQL injection | Input එකෙන් SQL query එක වෙනස් කිරීම | Bind Eloquent/query-builder values; bind raw values; allowlist identifiers | Use PDO prepared statements; avoid concatenated SQL | Inputs remain data; unknown sort keys fail |
| XSS | User content එක browser code ලෙස run වීම | Escaped Blade output; maintained sanitizer for intended rich HTML | Encode for actual output context | Stored and reflected content cannot execute in the browser |
| CSRF | Logged-in browser එකෙන් unwanted action කරවීම | Keep version-appropriate request-forgery middleware; `@csrf` | Session-bound unpredictable tokens; safe comparison | Cross-site state change without valid protection fails |
| Broken authorization / IDOR | වෙනත් user/tenant record එකට access ලැබීම | Policies/Gates, tenant scopes on reads/writes/downloads/jobs | Server-side actor/action/resource/tenant checks | User A cannot access user B's records |
| Mass assignment | Extra fields හරහා role/owner/balance වෙනස් කිරීම | Explicit writable fields, restricted `$fillable`, server-owned privileged values | Explicit field mapping | Submitted admin/owner/tenant fields cannot override trusted values |
| Weak authentication | Password guessing/account takeover | Maintained auth flows, MFA, throttling, secure reset | `password_hash`/`password_verify`, throttling, single-use expiring recovery tokens | Invalid/expired credentials fail; repeated attempts limited |
| Session fixation/hijacking | Session ID එකෙන් වෙනත් account එක භාවිත කිරීම | Regenerate after login; invalidate logout; secure cookies | Strict native sessions, HTTPS, rotation, explicit expiry | Login rotates ID; logout retires authentication |
| Unsafe uploads / web shells | Upload එක server code ලෙස run වීම හෝ data leak වීම | Type/content/size validation; generated names; private disk; authorized download | Outside webroot; deny execution and handler overrides | Disallowed files fail; no execution; private downloads protected |
| Command/code injection / RCE | Input එකෙන් server commands/PHP run කිරීම | Avoid user-controlled shell/Process/eval/template compilation | Prefer libraries; fixed executable and validated arguments | Trace inputs to all execution sinks |
| Unsafe deserialization | Crafted object data එකෙන් unintended code run වීම | Avoid untrusted PHP serialization in custom cookies/queues/cache | JSON plus schema checks; no untrusted `unserialize` | No external input reaches unsafe deserialization |
| Path traversal / LFI / RFI / Zip Slip | අවසර නැති file කියවීම/ලිවීම/include කිරීම | Authorized opaque IDs mapped to stored paths; fixed template map | Canonical root containment; safe archive extraction; fixed includes | Reject escapes and unsafe archive paths; cover Windows separators |
| SSRF | Server එකෙන් internal services වෙත request කරවීම | Review URL previews, fetchers, webhooks, HTTP clients | Restrict destination/scheme/port, DNS/IPs, redirects; egress enforcement | Internal/metadata/loopback/IPv6 and redirect bypasses blocked |
| Secret/debug exposure | `.env`, keys, stack traces පිටවීම | Disable production debug; serve `public/`; restrict diagnostics | Secrets outside document root; hide displayed errors | Sensitive paths denied; error internals hidden |
| Vulnerable dependencies/runtime | පරණ PHP/package flaw එකක් exploit කිරීම | Audit lockfile and support status; tested updates | Patch PHP/extensions/Composer/OS/web server; verify backports | Confirm deployed fixed build and applicable advisory |
| API data exposure / CORS | API එකෙන් private fields/unintended browser access ලැබීම | Resource allowlists, Policies, token scopes, narrow credentialed CORS | Minimal responses; appropriate token verification | Unauthorized API calls fail; private fields absent |
| Open redirect / unsafe URLs | Trusted site එකෙන් malicious URL එකකට යැවීම | Fixed internal routes or approved targets | Allowlist redirect targets and URL schemes | Unapproved destinations/script URLs rejected |
| Business logic / races | Payments/stock/bookings rules bypass කිරීම | Trusted totals; `DB::transaction()` with `lockForUpdate()` where appropriate; constraints and idempotency | Enforce invariants at service/database boundaries | Concurrent duplicate operations cannot violate rules |
| Background jobs / queue trust | Request එකෙන් පසුව permission/data වෙනස් වුණත් job එක action කිරීම | Explicit actor/tenant context; worker-side authorization and state checks; protected queue backend | Authenticate producers; restrict broker access; minimize payload secrets; idempotent consumers | Revoked access, changed/deleted models, retries and tenant changes handled safely |
| Resource exhaustion / ReDoS | Costly inputs හරහා service එක slow/down කිරීම | Bound pagination, searches, uploads, queues and usage | Bound request/response size, regex work, timeouts, archive expansion | Over-limit input rejected before expensive work |
| Forged/replayed webhooks | Fake/repeated event එක valid action ලෙස ගැනීම | Provider signature on exact raw body; replay/idempotency checks | Validate provider-specific signature, timestamp and event identity | Invalid/stale/duplicate events cannot repeat an action |

UUIDs, hidden buttons, frontend validation, CORS, HTTPS or a WAF alone do not authorize resources. Validation does not replace authorization. A signed URL verifies integrity/expiry; enforce ownership when the feature requires it. Use targeted sources [4–18] for relevant details.

## 3. Apply safe coding patterns

Label assumptions; snippets are patterns, not complete production applications. Add imports, policies, middleware, configuration and regression tests when implementing them.

### SQL values versus identifiers

```php
// Laravel: $email is validated as a string.
$user = User::query()->where('email', $email)->first();
$rows = DB::select('SELECT id, name FROM users WHERE email = ?', [$email]);

// Public sort keys map to fixed server-owned column names.
$columns = ['newest' => 'created_at', 'name' => 'name'];
$key = $request->input('sort', 'newest');
abort_unless(is_string($key) && isset($columns[$key]), 422);
$users = User::query()->orderBy($columns[$key], 'asc')->paginate(25);
```

```php
// Plain PHP: configured $pdo; validated string $email.
$stmt = $pdo->prepare('SELECT id, name FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
```

Placeholders protect values, not identifiers/keywords. Inspect `whereRaw`, `orderByRaw`, `DB::unprepared` and concatenated expressions. HTML escaping does not protect SQL. [4, 5]

### Output encoding

```blade
<p>{{ $comment->body }}</p>
<script>
    const settings = {{ Illuminate\Support\Js::from($settings) }};
</script>
```

```php
// Plain PHP HTML text / quoted attribute context; string input.
echo htmlspecialchars($displayName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
```

Avoid raw Blade `{!! !!}`, unsafe `innerHTML` and user-controlled inline event handlers. HTML escaping does not secure JavaScript/CSS/URL contexts; validate URL schemes separately. Sanitize intentionally supported rich HTML with a maintained allowlist sanitizer; `strip_tags` is insufficient. Use tested CSP as defense in depth. [6, 7]

### Authorization and controlled updates

```php
// Authenticated route; registered PostPolicy checks owner/tenant and action.
// Imports: Illuminate\Http\Request; Illuminate\Support\Facades\Gate; App\Models\Post.
public function update(Request $request, Post $post)
{
    Gate::authorize('update', $post);
    $data = $request->validate([
        'title' => ['required', 'string', 'max:200'],
        'body' => ['required', 'string', 'max:20000'],
    ]);
    $post->title = $data['title'];
    $post->body = $data['body'];
    $post->save();
    return response()->noContent();
}
```

Cover list queries, relations, exports and downloads too. Route binding alone does not authorize. For mass assignment use explicit `$fillable` allowlists and selected validated fields; never pass `$request->all()` into sensitive models. Validate allowed nested array keys: validating only the parent array can preserve unwanted keys. Set actor/tenant/role/trusted totals on the server. [8, 9, 12]

### Request-forgery protection

```blade
<form method="POST" action="/profile">
    @csrf
    <input name="name" value="{{ old('name') }}">
    <button type="submit">Save</button>
</form>
```

Keep GET/HEAD read-only. In plain PHP session applications generate tokens with `random_bytes`, store in the session, validate token types, and compare with `hash_equals` before state changes. Never put tokens in URLs.

Match middleware configuration to the installed Laravel version. Laravel 13 uses `PreventRequestForgery` with origin verification and token fallback; earlier versions differ. Do not bypass protection to fix a 419. Preserve stateful session/CSRF settings for Sanctum cookie-authenticated SPAs. Truly stateless bearer-token endpoints have a different CSRF threat model: inspect how credentials are actually sent. Narrow webhook exceptions require independent signatures. [10]

### Passwords and sessions

Use Laravel `Hash::make`/`Hash::check` or PHP `password_hash`/`password_verify`. Use maintained bcrypt/Argon2 APIs, future rehashing and sufficient hash-column length (commonly 255). Never store plaintext/MD5/SHA-1 password hashes. [11, 13]

Regenerate Laravel sessions after successful login. On logout call `Auth::logout()`, invalidate the session and regenerate the CSRF token. Throttle login, OTP, resets and high-cost endpoints with shared state across workers. [11]

For native PHP sessions configure strict mode, cookie-only IDs, Secure/HttpOnly, suitable SameSite and timestamp-based expiry; rotate at authentication/privilege changes. Follow PHP guidance for concurrent requests and old-session retirement. Native PHP session directives do not automatically configure Laravel's session system. [14]

### Named API and login rate limits

Merge these definitions into the existing `AppServiceProvider::boot()`; do not replace other boot logic. Example quotas require tuning. [22]

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('secure-api', function (Request $request) {
        $actor = $request->user();
        $key = $actor ? 'user:'.$actor->getAuthIdentifier() : 'ip:'.$request->ip();
        return Limit::perMinute(60)->by($key);
    });

    RateLimiter::for('secure-login', function (Request $request) {
        $email = $request->input('email');
        // Match the actual login flow's normalization; assume case-insensitive email.
        $email = is_string($email) && strlen($email) <= 254
            ? mb_strtolower(trim($email), 'UTF-8') : 'invalid';
        $key = hash_hmac('sha256', $email.'|'.$request->ip(), config('app.key'));
        return [
            Limit::perMinute(20)->by('ip:'.$request->ip()),
            Limit::perMinute(5)->by('identity-ip:'.$key),
        ];
    });
}
```

Attach the named limiter to the existing route; defining it alone does not enforce it. Examples assume existing controller actions and configured Sanctum. Keep login on the protected `web` routes for session authentication. Adapt the auth guard to the project; avoid duplicate routes or competing starter-kit/Fortify limiters. [22]

```php
// routes/api.php; import the project's ProfileController and Route facade.
Route::get('/profile', [ProfileController::class, 'show'])
    ->middleware(['auth:sanctum', 'throttle:secure-api']);

// routes/web.php; import the project's LoginController and Route facade.
Route::post('/login', [LoginController::class, 'store'])
    ->middleware('throttle:secure-login');
```

Use shared limiter storage across instances and correct trusted-proxy configuration; do not accept spoofed client IP headers. Never key counters on passwords/tokens. This example counts every attempt, including successful requests. IP plus identity/IP limits do not stop all distributed credential stuffing; tune additional risk controls without enabling easy account lockout. Verify limit exhaustion returns 429, identities have intended isolation and expiry restores access.

### Background jobs and queue authorization

With standard Laravel model serialization (`SerializesModels`/the relevant queue traits), Eloquent models are represented by identifiers and relationship metadata, then retrieved again by the worker: do not describe this as a reliable frozen copy of all model attributes. Relation query constraints are not preserved; use `withoutRelations()` or explicitly reload constrained relations when needed. Scalar/custom snapshots can still be stale. [21]

Authorize dispatch, then apply an explicit worker authorization policy: for user-delegated work, load the actor and tenant and use `Gate::forUser($actor)->authorize(...)` against freshly scoped resources. For intentionally durable system work, validate the recorded grant/system authority rather than relying on ambient `auth()`. Recheck current status, cancellation, ownership and invariants; handle deleted records and revoked access deliberately. These checks follow the application's authorization design. [8]

Restrict queue producers, backend access and failed-job visibility; minimize payload secrets. Dispatch transaction-dependent jobs using `->afterCommit()` or configured `after_commit`. Make effects idempotent because retries can repeat them; unique-job locks alone are not an exactly-once guarantee. [21]

### Transactions and pessimistic locking

Keep the read/check/write in one transaction and acquire the lock before checking stock/balance. A transaction alone does not prevent every race. Example: a controller operation using the default database connection, authenticated user, integer stock and an existing `ProductPolicy::reserve` that enforces tenant/role rules. [4, 23]

```php
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

public function reserve(Request $request, int $productId)
{
    $data = $request->validate(['quantity' => ['required', 'integer', 'min:1', 'max:100']]);
    $quantity = (int) $data['quantity'];
    $tenantId = $request->user()->tenant_id; // Trusted context, never request input.

    DB::transaction(function () use ($productId, $tenantId, $quantity) {
        $product = Product::query()->where('tenant_id', $tenantId)
            ->whereKey($productId)->lockForUpdate()->firstOrFail();
        Gate::authorize('reserve', $product);
        if ($product->stock < $quantity) {
            throw ValidationException::withMessages(['quantity' => 'Insufficient stock.']);
        }
        $product->stock -= $quantity;
        $product->save();
        // Persist the related reservation/ledger entry in this same transaction.
    }, 3); // Bounded deadlock retry; keep the callback safe to repeat.

    return response()->noContent();
}
```

Use a database/engine that supports the required row-lock semantics and test with the production engine; SQLite is not a substitute for that concurrency test. Apply compatible locking/atomic conditions to every competing writer. Lock multiple rows in a consistent order, keep transactions short and avoid external side effects inside retryable callbacks. For money use integer minor units or exact decimal arithmetic. Add database invariants and a unique, actor-scoped operation key for retry/idempotency where required; a lock alone does not stop duplicate deductions from repeated requests. Use after-commit work or a transactional outbox for external effects. [23]

### Uploads

```php
// Authenticated route, UploadPolicy create permission, configured private disk
// outside webroot, and existing uploads() relation/model with allowed path field.
Gate::authorize('create', Upload::class);
$request->validate([
    'document' => ['required', 'file', 'mimes:pdf', 'max:5120'],
]);
$path = $request->file('document')->store('documents', 'private');
$upload = $request->user()->uploads()->create(['path' => $path]);
```

Configure `private` explicitly; do not assume that disk exists. Generate storage names rather than trusting original names. MIME checks do not prove harmlessness. Add malware scanning/content disarm where the use case warrants it. Authorize downloads, use safe response headers, block script execution and handler overrides, bound processing, and clean up orphaned files if persistence fails. Private files must not be reachable through public symlinks. Avoid SVG/active content unless specifically sanitized and safely served. [12, 15]

### Execution, serialization and network boundaries

Do not pass untrusted data to `eval`, dynamic includes, shell strings, user-authored Blade compilation or `unserialize`. `allowed_classes=false` does not make untrusted deserialization safe. Prefer JSON plus type/structure validation. If external tools are necessary, use a fixed executable, structured arguments, explicit input allowlists, option separation where supported, timeouts, least privilege and no shell interpolation. Escaping alone does not prevent option injection. [16]

For SSRF, URL syntax validation alone is insufficient. Restrict destinations/schemes/ports; check all resolved IPs; disable redirects or revalidate each hop. Address DNS rebinding through connection-aware enforcement or an egress proxy/firewall. Cover IPv4, IPv6, private, loopback, link-local and cloud-metadata destinations. Bound time and response bytes. [17]

## 4. Harden deployment

- Serve Laravel through `public/`. Keep `.env`, Git metadata, vendor/source, logs, dumps, archives and backups inaccessible over HTTP. [18]
- Use `APP_ENV=production`, `APP_DEBUG=false`; disable displayed PHP errors and restrict logs. Redact secrets, cookies, authorization headers and private data. [18]
- Protect `APP_KEY`; never regenerate it casually. Rotation can invalidate sessions or make encrypted data unreadable: plan supported rotation, backups and exposure response.
- Enforce HTTPS and correct host/proxy trust. Configure secure cookies with minimal domain scope; check `config/session.php` mappings before copying environment settings. Use `SameSite=None; Secure` only when required and retain request-forgery protections.
- Apply least privilege to DB users, service accounts and filesystem access. Grant writes only where needed; never recommend blanket `777`. Adapt permissions to Windows/IIS or Linux.
- Patch PHP, extensions, Composer, web server and OS. Disable unused capabilities and consider `allow_url_include=Off` where applicable. Do not present `disable_functions`, `open_basedir`, version hiding or a WAF as a patch substitute/security boundary.
- Protect dashboards/diagnostics with authorization. Restrict Redis/database/session services. Encrypt and restrict backups; test restoration.
- Review dependency scripts/plugins before executing them. Build from a reviewed lockfile; avoid unreviewed production `composer update`. Restart relevant persistent workers/services after deployment.
- Add tested CSP, `X-Content-Type-Options`, framing restrictions and Referrer-Policy. Enable HSTS only after assessing HTTPS and subdomain implications.
- Run version-appropriate config caching only as a planned deployment action after checking config usage. Never fix issues through global CSRF exemptions, wildcard credentialed CORS, or disabled TLS verification.

## 5. Verify CVEs and advisories

For each advisory record the checked date, canonical ID, exact component/version range, prerequisites, application reachability, fixed release/vendor backport, mitigation, primary-source URL and deployment evidence. A name such as “PHP2Shell” does not establish the affected component or exploit path. Never invent CVEs or infer confirmed exploitation from a version range alone.

Recheck PHP releases/advisories, Laravel/package advisories and the OS/hosting vendor. Do not freeze patch versions in this skill. Mark unavailable configuration evidence as conditional/unverified. [1–3, 19, 20]

As a **dated example only**, PHP's 2026-10-23 notice describes an unusual native-session upload-progress RCE vector: configured `php_binary`/`php_serialize` serialization is changed to `php` using `ini_set()` before `session_start()`, while upload progress remains enabled. The notice recommends `session.upload_progress.enabled=0` pending the next regular bugfix release and says applications without that runtime serializer change may keep the feature enabled. Recheck current advice and effective web-SAPI configuration before applying it. Do not assume Laravel sessions meet these conditions. This is not a complete account of the separate October 21 advisories/remediation. [20]

## 6. Validate real behavior

1. Write focused regression tests with denied and allowed paths using isolated databases and mocked network/payment services.
2. Use two users and, where relevant, two tenants for read/update/delete/download/export checks. Avoid unintended resource-existence leaks.
3. Submit forbidden mass-assignment fields and nested keys; assert stored privileged values remain trusted.
4. Verify SQL inputs remain data and XSS output is safe in its actual browser context, including stored content. Search matches alone are not confirmed findings.
5. Account for CSRF middleware bypass in test environments and version-specific origin handling. Use a real middleware/integration/browser check; assert denial and unchanged state rather than one universal status code.
6. Test upload non-execution, authorization, path boundaries, SSRF redirects and failure handling with harmless fixtures/test services.
7. Run relevant existing tests/static analysis. Recheck advisories after dependency changes and review lockfile differences. Never reset an unknown/live database.
8. Report actual commands/results and missing coverage. Do not claim runtime validation from code inspection or declare an application “100% secure”.
9. For jobs, test permission revocation and state changes between dispatch and execution, missing models, constrained relations and duplicate delivery. Use an isolated worker test: `Queue::fake()` alone does not exercise serialization or worker behavior.
10. For throttling, test 429 thresholds, identity isolation, expiry and shared counters across instances. For stock/balance, use concurrent independent transactions on the production database engine; verify no negative stock/balance, rollback on failure and no duplicate effect for the same operation key.

For suspected compromise, explain that patching does not remove an intruder. Preserve evidence, contain affected services, assess credential/data exposure and recover from a trusted state under the organization's incident process. Do not silently erase logs/production files.

## 7. Return actionable findings

For general questions, explain relevant issues with examples and a prioritized checklist. For an audit use:

| Priority | Finding/status | Evidence | Impact/prerequisites | Fix | Verification |
| --- | --- | --- | --- | --- | --- |
| Risk-based severity | Confirmed / conditional / unverified | File and line, exact config/version; redact secrets | Concrete operation and trust boundary | Specific code/config/update change | Actual result or clearly marked pending check |

Prioritize reachable unauthenticated execution, exposed secrets, cross-tenant access and auth bypass according to actual impact. Separate severity from remediation urgency. Report changed files, tests and unresolved items without claiming work not performed.

Example prompts:

- “Laravel project eke SQL injection, XSS, IDOR thiyenawada balala fix karanna.”
- “Plain PHP login/upload code eka secure karala Sinhala walin explain karanna.”
- “Mage PHP version ekata me CVE eka adalada official advisory ekath ekka verify karanna.”
- “Production deploy karanna kalin security checklist eka apply karanna.”

## Official references

Use documentation matching the installed major version; Laravel 13 links are reviewed examples, not an instruction to upgrade every project to 13.

1. [PHP supported versions](https://www.php.net/supported-versions.php)
2. [Laravel support policy](https://laravel.com/docs/13.x/releases#support-policy)
3. [Composer audit](https://getcomposer.org/doc/03-cli.md#audit)
4. [Laravel queries](https://laravel.com/docs/13.x/queries)
5. [PHP PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php)
6. [Laravel Blade](https://laravel.com/docs/13.x/blade)
7. [PHP htmlspecialchars](https://www.php.net/manual/en/function.htmlspecialchars.php)
8. [Laravel authorization](https://laravel.com/docs/13.x/authorization)
9. [Eloquent mass assignment](https://laravel.com/docs/13.x/eloquent#mass-assignment)
10. [Laravel request-forgery protection](https://laravel.com/docs/13.x/csrf)
11. [Laravel authentication](https://laravel.com/docs/13.x/authentication)
12. [Laravel validation](https://laravel.com/docs/13.x/validation)
13. [PHP password_hash](https://www.php.net/manual/en/function.password-hash.php)
14. [PHP session security](https://www.php.net/manual/en/features.session.security.management.php)
15. [OWASP file uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
16. [PHP unserialize warning](https://www.php.net/manual/en/function.unserialize.php)
17. [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
18. [Laravel deployment](https://laravel.com/docs/13.x/deployment)
19. [Laravel security advisories](https://github.com/laravel/framework/security/advisories)
20. [PHP 2026 archive: October 23 advisory](https://www.php.net/archive/2026.php#2026-10-23-1)
21. [Laravel queues: model serialization, retries and transactions](https://laravel.com/docs/13.x/queues)
22. [Laravel routing: named rate limiters and throttle middleware](https://laravel.com/docs/13.x/routing#rate-limiting)
23. [Laravel database transactions and deadlock retries](https://laravel.com/docs/13.x/database#database-transactions)
