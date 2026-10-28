---
name: secure-nextjs-frontend
description: Explain, review, and fix Next.js frontend and React security risks including XSS, browser secrets, auth/session handling, CSRF, unsafe redirects, private-data caching, Server Actions, Route Handlers, SSRF, uploads, dependencies and deployment. Use for Next.js security questions, code audits, secure feature implementation or production hardening, including Next.js frontends with Laravel/Sanctum backends. Explain in Sinhala with familiar English technical terms unless the user prefers another language.
---

# Secure Next.js Frontend

## Purpose and boundaries

Explain each relevant issue as **මොකක්ද → හානිය මොකක්ද → protect වෙන්නේ කොහොමද → verify කරන්නේ කොහොමද**. Use simple Sinhala and familiar English technical terms; keep identifiers/code in English.

Separate browser/React weaknesses, Next.js server boundaries, backend authorization/business rules, dependency defects and hosting configuration. A hidden button, client route guard, UUID, CORS rule or frontend schema is not backend authorization. Never claim an unseen app is audited or that frontend changes alone secure its backend.

Source review date: **2026-10-25**. Check documentation for the installed version; do not freeze current CVEs or patch versions in this skill. Apply companion `$secure-laravel-php` when reviewing a Laravel backend, if available; this skill remains usable independently.

## 1. Establish the architecture

1. Read project instructions, `package.json`, lockfile, Next/React/Node versions, `next.config.*`, auth configuration and relevant code. Inspect `app/` versus `pages/`, `use client`/`use server`, route handlers/API routes, Server Components, Server Actions, Proxy/Middleware and API wrappers.
2. Identify static export versus server deployment, Node/Edge/serverless runtime, CDN/reverse proxy, cache features, third-party scripts, uploads, analytics, service workers and package manager. Static exports cannot enforce server authorization or run Server Actions; enforce these on the API/backend.
3. Map browser → Next server/BFF → backend. Identify session cookies versus bearer tokens, actor/tenant source, CORS origins, trusted proxy headers and every data/command/network sink. Ask only for missing facts that materially block a fix.
4. Inspect configuration without printing `.env`, credentials, tokens, patient/customer records or full cookies. Use placeholder values in examples. Never request production secrets.
5. Confirm a trusted checkout and isolated services before package installs, builds or tests: scripts execute project/dependency code. Respect the lockfile/package manager and existing conventions. Do not mix package managers.

Use relevant commands; do not run mutation-heavy commands blindly:

```text
node --version
npm ls next react react-dom --depth=0
npm audit --json
```

For pnpm/Yarn use their version-appropriate audit commands. Inspect scripts before running existing lint/typecheck/test/build tasks. Do not assume `next lint` exists. Report audit network failures and unexecuted checks. Never use `npm audit fix --force` as an automatic security solution. A clean audit is not proof of secure application logic. [15]

## 2. Select relevant risks

| Risk | සරල අදහස / impact | Protection | Verification |
| --- | --- | --- | --- |
| Reflected/stored/DOM XSS | User content browser code ලෙස run වීම | Render text with React; sanitize intentionally allowed HTML; audit DOM sinks and Markdown plugins | Stored/reflected content cannot execute in actual browser context |
| Unsafe URLs / open redirect | User එක malicious destination එකකට යැවීම | Server-owned routes or explicit URL allowlists; reject script schemes/protocol-relative redirects | External/encoded/odd-scheme inputs fail closed |
| Secret leakage | Browser bundle/RSC/props/logs හරහා keys පිටවීම | Keep secrets server-side; minimal DTOs; treat public env/build output as public | Inspect production JS, HTML, RSC and network responses |
| Broken authorization / IDOR | වෙනත් user/tenant data ලබාගැනීම | Server checks on every read/write/download/action; scoped queries | Two users/tenants cannot cross access boundaries |
| Server Action / Route Handler abuse | UI bypass කර direct request යැවීම | Verify session, input, ownership, permissions, quotas and trusted values at execution | Direct unauthenticated/forbidden invocation fails |
| Session/token theft | Browser storage/XSS හරහා account භාවිත කිරීම | Maintained auth library, secure HttpOnly cookies where appropriate, expiry/revocation | Logout/expiry terminate access; no unintended token exposure |
| CSRF / login CSRF | Browser credentials භාවිත කර unwanted action කරවීම | Correct cookie-auth CSRF/origin validation per endpoint; read-only GET | Real cross-site mutation rejected; valid flow works |
| Private-data cache leak | User Aගේ response එක user Bට ලැබීම | Explicit per-user cache policy across Next/CDN/browser/client caches | Warm as A, request as B/guest and after logout |
| SSRF / image proxy abuse | Next server internal/metadata URL fetch කිරීම | Fixed destinations, restricted image patterns, redirects/IP/egress controls | Local/private/IPv6/redirect destinations blocked |
| Upload abuse | File එකෙන් code execution/XSS/data leak වීම | Backend validation/scanning, generated private paths, authorized signed uploads/downloads | Unauthorized/oversized/active files rejected; private files not public |
| Brute force / resource exhaustion | Login/search/render/API overload කිරීම | Persistent server-side rate limits, bounded work/body size/timeouts | Quotas enforced across instances; 429 and bounded retries |
| Duplicate mutations / races | Double click/retry හරහා multiple charges/bookings | Backend transactions, concurrency rules and idempotency keys | Concurrent duplicate requests create one intended effect |
| CORS misconfiguration | Unintended origins වලින් credentialed access | Narrow origin allowlist; correct credentials/preflight handling | Unapproved origin receives no credentialed access |
| Clickjacking / weak CSP | Embedded UI හරහා deceptive actions/code execution | Tested CSP and framing policy with deployment-specific exceptions | Inspect headers and browser violations on deployed pages |
| Third-party script/supply chain risk | Package/script එකෙන් app/browser compromise වීම | Reviewed dependencies, lockfile, trusted origins, minimal script permissions | Audit transitive packages/scripts and deployed versions |
| Browser messaging/storage leaks | postMessage/storage/service worker හරහා data leak වීම | Exact origin/source/schema checks; minimize storage and cached private data | Forged messages and post-logout cache retrieval fail |
| Information disclosure | Errors/source maps/analytics හරහා internals/private data පිටවීම | Minimal errors/logs; restrict diagnostic artifacts; scrub telemetry | Production errors and analytics exclude secrets/records |
| Runtime/framework vulnerabilities | Next/React/Node bug එක exploit කිරීම | Verify exact advisory applicability; patch and redeploy affected builds | Actual deployed build and relevant advisory rechecked |

Use [1–18] for relevant framework/browser guidance; confirm each finding from an actual input-to-impact path. Do not present the table as completed test coverage.

## 3. Use secure implementation patterns

Treat examples as patterns, with assumptions stated. Adapt imports, schemas, routes and storage to the actual project; do not invent a working auth provider or assume placeholder helpers enforce security.

### React output and inline structured data

```tsx
// Safe text rendering; do not replace with raw HTML for user text.
export function Comment({ body }: { body: string }) {
  return <p>{body}</p>
}
```

Audit `dangerouslySetInnerHTML`, DOM `innerHTML`, `insertAdjacentHTML`, untrusted Markdown/raw HTML, `eval`, `new Function`, `javascript:` URLs and DOM-manipulating dependencies. Use a maintained allowlist sanitizer for intended rich HTML and a supported server DOM adapter if sanitizing during SSR; keep both patched. Never sanitize only in the browser or treat regex/`strip_tags` as HTML sanitization. React text escaping does not authorize URLs or secure raw HTML/JavaScript contexts. [5]

```tsx
// Structured data only: project-owned schema and allowlisted fields.
const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: title }
const serialized = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
// Render only this serialized object, never raw user-authored script text.
const structuredData = <script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: serialized }} />
```

Do not interpolate arbitrary text into executable `<script>` contents. Test closing-tag input in browser output, not only a string assertion. [16]

### Fixed internal redirects

Prefer a server-owned route map over accepting arbitrary return URLs:

```ts
const returnRoutes = { home: '/', dashboard: '/dashboard', profile: '/profile' } as const
export function safeReturnPath(value: unknown): string {
  return typeof value === 'string' && Object.hasOwn(returnRoutes, value)
    ? returnRoutes[value as keyof typeof returnRoutes]
    : '/dashboard'
}
// Pass the resolved path to router.replace()/redirect(); never pass raw input.
```

If the product needs arbitrary internal paths or external links, implement a separate URL parser with an explicit trusted base, origin/scheme checks and allowed destinations. Recheck at the server where the redirect/action occurs. Do not trust a client-supplied Host header as the trusted origin. Consider encoded/protocol-relative/backslash inputs and callback destinations. [17]

### Server-only secrets and minimal data

Use `import 'server-only'` in sensitive modules and keep credentialed access outside the client import graph. `use server` is not a generic secret-container marker: it exposes callable action boundaries. Avoid passing ORM records or upstream responses wholesale to Client Components. Map only necessary fields and inspect nested data. [1]

Treat `NEXT_PUBLIC_*` values as public, including API base URLs. Public variables are inlined into browser code at build time; do not put service keys, auth secrets or database URLs there. Other env/config values can also leak through `next.config` env exports, serialized props, responses, source maps and logs. Never put secrets in `public/`. Changing deployment env alone may not replace an already-built public value; rebuild/redeploy when required and rotate exposed secrets. [4]

### Authenticate and authorize Server Actions / endpoints

Use a maintained auth/session integration. Recheck the actor at each sensitive entry point and scope data operations to the actor/tenant close to the data source. Proxy/Middleware redirects and layout/page checks are supplementary; they do not establish permission for every nested endpoint or mutation. Verify version-specific `middleware.ts` versus `proxy.ts` behavior. [2]

```ts
// app/actions/posts.ts — App Router Server Action pattern.
'use server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth' // Existing verified session; throws if invalid.
import { db } from '@/lib/db' // Existing server-only Prisma-style client.
import { assertMutationQuota } from '@/lib/rate-limit' // Existing shared-store limiter.

const schema = z.object({
  postId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
}).strict()

export async function renamePost(input: unknown) {
  const actor = await requireUser()
  const data = schema.parse(input)
  await assertMutationQuota(actor.id)
  const changed = await db.post.updateMany({
    where: { id: data.postId, tenantId: actor.tenantId, ownerId: actor.id },
    data: { title: data.title },
  })
  if (changed.count !== 1) throw new Error('Operation not permitted')
  return { ok: true }
}
```

Assume trusted session-derived actor/tenant IDs and matching model fields; implement all imported helpers before use. This example supports owner edits only; add explicit policy checks for other roles/status rules and handle validation errors without leaking internals. Never accept role/tenant/price from client props, hidden inputs or decoded-but-unverified tokens. Treat action arguments, bound arguments and IDs as untrusted. Keep output minimal. [1, 2]

For Route Handlers/API routes apply equivalent authentication, authorization, validation and safe error behavior; add the endpoint's own request-forgery defense for cookie-authenticated state changes. Server Action protections do not automatically protect arbitrary endpoints. Keep GET/HEAD/rendering free from business mutations.

### Cookie sessions, CSRF and Laravel integration

Prefer maintained session handling; set HttpOnly, Secure in production, suitable SameSite, narrow domain/path, expiry and revocation. Avoid long-lived session/access tokens in localStorage/sessionStorage; XSS can read them. HttpOnly reduces token theft but does not stop XSS from acting as the user. Verify signed tokens, not just decoded claims; apply issuer/audience/expiry/algorithm rules through the auth library. [2, 11]

Retain Next's version-appropriate Server Action origin protections; keep `allowedOrigins` narrow when a trusted reverse proxy requires exceptions. Do not disable checks or trust arbitrary forwarded hosts to resolve deployment errors. POST alone is not a universal CSRF defense. SameSite and CORS are not complete substitutes for endpoint-specific CSRF protections. [7, 12]

For **direct browser → Laravel Sanctum cookie auth**, verify the supported same-site domain arrangement, stateful domains, HTTPS/cookie domain, exact credentialed CORS origins, backend session middleware and CSRF flow. Initialize `/sanctum/csrf-cookie`, then send the URL-decoded `XSRF-TOKEN` value in `X-XSRF-TOKEN` with credentials on protected mutations. Use a correctly configured client with explicit XSRF support; native `fetch` does not add this header automatically. The XSRF cookie is intentionally readable and is not the session cookie. Never disable Laravel CSRF to fix a 419. [13]

For **browser → Next BFF → Laravel**, specify who owns the browser session and how Next authenticates/authorizes backend calls. Server-side `fetch` does not automatically inherit browser cookies; forward only intended credentials to fixed trusted origins. Never turn the BFF into an arbitrary authenticated proxy or forward credentials across redirects. Do not pretend browser Sanctum setup solves this architecture automatically. Apply backend Policies, validation, rate limits and transaction rules regardless of the UI.

### Private data and cache isolation

Inspect Next data/render caches, ISR/static export, Cache Components/`use cache`, React request memoization, CDN headers, service workers and SWR/React Query caches separately. Cache defaults differ by version; do not prescribe one version's defaults universally. [8, 9]

For private upstream requests where the installed fetch model supports it, use `fetch(fixedUrl, { cache: 'no-store', ... })` and keep credential forwarding narrow. Do not combine contradictory cache/revalidation options. In sensitive Route Handler responses use an appropriate policy such as `Cache-Control: private, no-store`; verify CDN behavior too. One header does not undo a wrongly shared internal cache. [8]

Do not place private data in a public/static shell or shared cache without deliberate identity isolation and invalidation. Do not cache authorization decisions globally. Apply the installed version's Cache Components rules rather than assuming `no-store` alone fixes every cached wrapper. Scope client query keys by account/tenant where needed and clear private caches on logout/account switch. Test A → B → guest with warmed caches, navigation/prefetch and browser back button. [9, 10]

### SSRF, images and uploads

Use fixed upstream hosts for BFF/API wrappers. If URLs must be user-controlled, enforce URL/DNS/IP/redirect controls and network egress restrictions, covering private/loopback/link-local/metadata addresses in IPv4/IPv6. URL syntax checks and an initial hostname check alone are insufficient. Bound time, response bytes and image processing. [18]

Merge restrictive image patterns into the existing config; adapt the example domain/path. Verify option support for the installed Next version. Restrict redirect behavior too: a permitted remote URL can redirect elsewhere. Do not enable local-IP image fetching or unsafe SVG serving casually. [6]

```js
// next.config.mjs — merge with existing options.
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https', hostname: 'media.example.com', port: '',
      pathname: '/approved-images/**', search: '',
    }],
    maximumRedirects: 0,
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
    ] }]
  },
}
export default nextConfig
```

Adapt framing policy if legitimate embedding is required. Static export needs equivalent headers at the hosting/CDN layer; `headers()` is not a universal hosting configuration. [14]

Treat browser upload validation as UX only. Enforce authorization, type/content/size limits, safe generated names and malware/content handling at the upload service. Scope presigned upload URLs to intended objects, expiry and operations; bind records to the actor. Restrict private download access and active HTML/SVG previews. Use safe download response headers and avoid exposing private files through `public/`. [19]

### Rate limits, retries and business invariants

Implement login, OTP, search, render, uploads and mutation quotas on the server using a persistent/shared store or backend/provider limiter with appropriate atomicity. In-memory counters reset and do not coordinate serverless instances. Identify actors from verified sessions; trust client IP only through configured proxy handling. Do not key counters on raw passwords/tokens. Debouncing and disabled buttons are UX aids, not abuse controls.

Handle 401/403/419/429 intentionally, respect retry guidance, cap retries and avoid login/refresh loops. Reuse an operation idempotency key for the same attempted payment/booking mutation; enforce its identity scope and uniqueness on the backend. Backend transactions, locks/atomic updates and ledger/stock rules must handle concurrency. Avoid side effects during render/prefetch. For queued backend work, require explicit actor/tenant authority, fresh state checks and idempotency; frontend permission checks do not carry into workers.

### Browser integrations, CSP and deployment

Validate `postMessage` exact origin, expected source and message schema; use an exact target origin when sending. Do not trust localStorage/IndexedDB values as permission claims. Restrict service-worker scope and private caching; clear sensitive data on logout. Audit third-party scripts, analytics and error telemetry for data collection; keep private form data and tokens out. [11]

Design CSP against actual script/style/font/image/connect/frame origins; begin in Report-Only and verify reporting/privacy. Use fresh unpredictable request nonces or a supported hash strategy as appropriate; nonce-based rendering changes dynamic/static/cache behavior. Never reuse a static nonce or weaken production policy with `unsafe-eval` to silence errors. Do not claim one generic CSP works for every Next rendering mode. Include suitable `frame-ancestors`, `object-src`, `base-uri` and `form-action` restrictions. [3]

Enforce HTTPS, assess HSTS including subdomains before enabling it, patch runtime/dependencies, restrict diagnostics and avoid production dev servers. Review trusted proxy/host rules and request limits with the host. Use reviewed lockfiles and vetted install scripts; never disable TLS verification as a fix. Protect preview deployments that contain private data. [20]

## 4. Verify CVEs without guessing

Record checked date, exact deployed Next/React/React DOM/Node versions, router/runtime/features in use, advisory ID, affected range, prerequisites, fixed releases, primary source and deployment evidence. Check Next, React and relevant package/runtime maintainers; distinguish framework flaws from app mistakes. Do not invent CVEs or copy stale patch numbers. A dependency audit alone does not check every hosting/runtime exposure. [15, 21, 22]

When patching, review compatibility, lockfile changes and release guidance; rebuild and redeploy all affected replicas/previews as appropriate. Verify the deployed build, not only local `package.json`. Rotate exposed secrets where required. If compromise is suspected, preserve evidence and follow incident response: patching alone does not remove an intruder.

## 5. Validate behavior and report evidence

1. Run applicable existing typecheck/lint/test/build checks after reviewing scripts. Never claim a sample snippet was run in a real app if only inspected.
2. Test browser XSS contexts, URL rules, raw HTML/sanitizer behavior, JSON-LD closing tags and third-party integration output with harmless fixtures.
3. Use two users/tenants for direct reads/actions/API mutations/downloads; test unauthenticated, expired/revoked and permitted paths. Hidden UI is not a denial test.
4. Check production JS, HTML, RSC payloads, props, error responses, logs and telemetry for private fields/secrets. Do not print discovered credentials in reports.
5. Test cookie flags, logout, account switching and actual cross-site CSRF behavior. Ensure backend calls fail without proper authority even if frontend guards are bypassed.
6. Warm caches as user A, request as B/guest, then test logout, refresh, navigation and CDN/client cache behavior.
7. Test rate thresholds/429, expiry and distributed counter behavior; test concurrent duplicate mutations against an isolated backend, not production.
8. Verify deployed headers/CSP, hydration, navigation, forms, images, static/CDN behavior and external integrations. Test SSRF with mock/internal test services; do not target real metadata endpoints.
9. Recheck relevant advisories after dependency changes. Report unavailable checks, missing access and pending backend/deployment work explicitly; never declare an app “100% secure”.

For audits return a concise table: **priority | confirmed/conditional/unverified finding | file/line or exact config/version evidence | impact/prerequisites | fix | test result/pending**. Prioritize actual secret exposure, cross-tenant access, reachable execution and auth bypass according to impact. Finish with changed files, actual checks and unresolved items.

Example prompts:

- “Next.js frontend eke XSS, token leak, private cache issues balala fix karanna.”
- “Next.js + Laravel Sanctum login flow eka secure karala Sinhala walin explain karanna.”
- “Server Actions direct call karala unauthorized updates karanna puluwanda review karanna.”
- “Production deploy karanna kalin frontend security checklist eka apply karanna.”

## Official references

Use documentation matching installed versions; current App Router examples do not automatically apply to Pages Router or static exports.

1. [Next data security and Server Actions](https://nextjs.org/docs/app/guides/data-security)
2. [Next authentication and authorization](https://nextjs.org/docs/app/guides/authentication)
3. [Next Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
4. [Next environment variables](https://nextjs.org/docs/app/guides/environment-variables)
5. [React DOM components and raw HTML](https://react.dev/reference/react-dom/components/common)
6. [Next Image configuration](https://nextjs.org/docs/app/api-reference/components/image)
7. [Next serverActions configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions)
8. [Next fetch configuration](https://nextjs.org/docs/app/api-reference/functions/fetch)
9. [Next use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)
10. [Next caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
11. [OWASP HTML5 security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
12. [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
13. [Laravel Sanctum SPA authentication](https://laravel.com/docs/13.x/sanctum#spa-authentication)
14. [Next custom headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
15. [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit)
16. [Next JSON-LD safe serialization](https://nextjs.org/docs/app/guides/json-ld)
17. [Next redirect API](https://nextjs.org/docs/app/api-reference/functions/redirect)
18. [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
19. [OWASP file upload security](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
20. [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
21. [Next security advisories](https://github.com/vercel/next.js/security/advisories)
22. [React official blog and security announcements](https://react.dev/blog)
