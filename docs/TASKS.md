# TASKS.md

Implementation tasks for CampusConnect. Per project rules, granular dev tasks for a feature are only added once that feature's full design (DB schema, API, UX, edge cases, security) is complete — not before.

## Status Overview

| Feature | Product Scope | DB Design | API Design | UX Design | Edge Cases | Security Review | Dev Tasks |
|---|---|---|---|---|---|---|---|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Community Feed | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Carpool | Deferred to v2 | — | — | — | — | — | — |
| Search | Deferred to v2 | — | — | — | — | — | — |
| Messaging | Deferred to v2 | — | — | — | — | — | — |
| Notifications | Deferred to v2 | — | — | — | — | — | — |

## Open Decisions Blocking Design
None currently. Mobile framework (React Native + Expo, D-006) and backend framework (FastAPI, D-007) were resolved 2026-07-28.

## Auth — Design Summary
Full design complete 2026-07-28. Passwordless, OTP-based (D-008, D-009), access+refresh token pattern (D-010). See `DECISIONS.md` D-006 through D-010 for rationale.

### DB Schema
```
universities (id, name, email_domain UNIQUE, created_at)
users (id, university_id FK, email UNIQUE, is_active, created_at, updated_at)
otp_requests (id, email, university_id FK, code_hash, purpose, attempt_count,
              max_attempts, expires_at, consumed_at, ip_address, created_at)
refresh_tokens (id, user_id FK, token_hash, device_label, expires_at,
                revoked_at, created_at)
```

### API
- `POST /auth/otp/request` `{email}` — validates .edu domain, rate-limited, sends OTP
- `POST /auth/otp/verify` `{email, code}` — creates or fetches user, issues access + refresh tokens
- `POST /auth/refresh` `{refresh_token}` — rotates refresh token, issues new access token
- `POST /auth/logout` `{refresh_token}` — revokes token
- `GET /auth/me` — protected, returns current user

### Edge Cases Covered
Unrecognized email domain; repeated OTP requests (rate limiting); wrong code / max attempts lockout; expired code; multi-device login; refresh token reuse detection (compromise signal → revoke all); reinstall/new device flow; university email reassignment (flagged as known limitation, not solved at MVP).

### Security
No password storage; OTP and refresh tokens hashed at rest; OTP rate-limited per email + IP; domain allowlist server-side only; consistent response shape to prevent user enumeration; HTTPS only; rotatable JWT signing secret.

### Complexity Estimate
Medium. Backend ~3–4 days, mobile ~2–3 days for one engineer each.

### Dev Tasks (ready for implementation — not yet started)
**Backend**
1. Migration: `universities`, `users`, `otp_requests`, `refresh_tokens` tables
2. Seed script for the initial university record
3. `POST /auth/otp/request` + email-sending service + rate limiting
4. `POST /auth/otp/verify` (create-or-fetch user, issue tokens)
5. `POST /auth/refresh` (rotation + reuse-detection)
6. `POST /auth/logout`
7. `GET /auth/me` + auth dependency/middleware
8. Unit tests: expired code, max attempts, domain rejection, token rotation, reuse detection

**Mobile**
9. Welcome + email-entry screen
10. OTP-entry screen (resend cooldown, error states)
11. Secure token storage + auth context
12. Auto-refresh interceptor on 401
13. Post-auth routing (new user → Profile setup, returning → Feed)

## Next Up
No code has been written yet for any feature. Auth is fully designed and its dev tasks (above) are ready to hand to an implementation tool once coding begins. Next **design** pass (not implementation): **Profile**, since Community Feed depends on it.# TASKS.md

Implementation tasks for CampusConnect. Per project rules, granular dev tasks for a feature are only added once that feature's full design (DB schema, API, UX, edge cases, security) is complete — not before.

## Status Overview

| Feature | Product Scope | DB Design | API Design | UX Design | Edge Cases | Security Review | Dev Tasks |
|---|---|---|---|---|---|---|---|
| Auth | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Profile | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Community Feed | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Carpool | Deferred to v2 | — | — | — | — | — | — |
| Search | Deferred to v2 | — | — | — | — | — | — |
| Messaging | Deferred to v2 | — | — | — | — | — | — |
| Notifications | Deferred to v2 | — | — | — | — | — | — |

## Open Decisions Blocking Design
- Mobile framework (React Native / Flutter / native) — affects API contract shape, needed before API design for Auth.
- Backend language/framework — not yet chosen.

## Next Up
Full design pass (DB → API → UX → edge cases → security → complexity estimate) for **Auth**, since Profile and Community Feed both depend on it. No dev tasks will be written until that pass is complete and reflected in this file.
