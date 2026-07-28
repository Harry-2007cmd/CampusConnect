# TASKS.md

Implementation tasks for CampusConnect.

**⚠️ Hackathon mode (2026-07-28 → deadline 2026-07-31, 3 days). Team of 3, working in parallel.** Rules relaxed per D-011/D-012. **Carpool is the primary, fully-polished demo feature. Community Feed is secondary/basic.**

## Team Split & Git Workflow

| Track | Person | Branch | Owns |
|---|---|---|---|
| A — Backend | _______ | `backend` | All FastAPI endpoints, DB migrations, seed scripts |
| B — Carpool Mobile | _______ | `mobile-carpool` | Browse/filter, ride detail, offer-ride, my-rides screens |
| C — Core Mobile | _______ | `mobile-core` | Auth/OTP screens, profile setup, feed screens |

**Workflow:**
- Branch off `main` at the start. Each person runs their own Claude Code session in their own branch/worktree, all pointed at this same `TASKS.md` and `CLAUDE.md`.
- B and C build against the API contracts already specified below (endpoint + request/response shape) using mocked responses — don't wait idle for A to finish.
- **Merge checkpoints:** end of Day 1 (backend API should be real and mergeable), midday Day 2 (swap mocks for real calls), end of Day 2 (everything integrated on `main`), Day 3 is `main`-only, no more branch work.
- If two people touch the same file (e.g. navigation setup), whoever finishes first merges to `main` and the other rebases — flag it in your team chat before it happens, not after.

## Status Overview (hackathon build)

| Feature | Scope for hackathon | Track |
|---|---|---|
| Auth | Trimmed: OTP login, single JWT, no rotation/rate-limiting | A (backend) + C (mobile) |
| Profile | Trimmed: name, year, department, gender | A (backend) + C (mobile) |
| Carpool | **Full polish — main demo.** Filter by price/place/gender | A (backend) + B (mobile) |
| Community Feed | Basic: create post, list, upvote | A (backend) + C (mobile) |

---

## Day 1

### Track A — Backend (do this first, others depend on it)
1. Repo scaffold: FastAPI project, Postgres connection, base migration setup
2. Migration: `universities`, `users` (id, university_id, email, name, year, department, gender, created_at), `otp_requests` (id, email, code_hash, expires_at, consumed_at)
3. Seed script: one university + several test accounts (mixed gender, for filter testing)
4. `POST /auth/otp/request` `{email}` → 200, no body — validates .edu domain, sends OTP
5. `POST /auth/otp/verify` `{email, code}` → `{access_token, user}` — creates or fetches user
6. `GET /auth/me` (bearer token) → `{id, email, name, year, department, gender}`
7. `PATCH /profile` `{name?, year?, department?, gender?}` → updated user object
8. `GET /profile/:id` → user object
9. Migration: `rides` (id, driver_id, university_id, origin, destination, departure_time, price_per_seat, seats_total, seats_available, gender_preference, notes, status, created_at), `ride_requests` (id, ride_id, rider_id, status, created_at, unique on ride+rider)
10. `POST /rides` `{origin, destination, departure_time, price_per_seat, seats_total, gender_preference, notes?}` → ride object
11. `GET /rides?origin=&destination=&max_price=&gender_pref=` → array of ride objects (include driver name)
12. `GET /rides/:id` → ride object with driver info
13. `POST /rides/:id/request` → request object (403 if gender mismatch or seats full or self-request)
14. `POST /rides/:id/requests/:reqId/accept` and `.../decline` (driver only) → updated request; accept decrements `seats_available`
15. `GET /rides/mine` → `{driving: [...], riding: [...]}`
16. `POST /rides/:id/cancel` (driver only)
17. Seed script: 10-15 realistic rides, varied price/route/gender_preference

**Push API contracts (request/response shapes above) to the team chat as soon as each endpoint is done — B and C are coding against these live.**

### Track B — Carpool Mobile (build against mocked API first)
18. Browse Rides screen: filter bar (price range, origin/destination text, gender preference toggle), ride cards — use mocked ride list matching task 11's shape
19. Ride Detail screen: full info + Request Seat button — mocked data first

### Track C — Core Mobile (build against mocked API first)
20. Welcome + email-entry screen
21. OTP-entry screen
22. Token storage + auth context (real logic, just point at mocked/local responses until A's endpoints are live)
23. Profile setup screen (name, year, department, gender)

**End of Day 1 checkpoint:** A's full API is real and testable via curl/Postman. B and C have working screens against mocked data, ready to swap in real calls.

---

## Day 2

### Track A — Backend
24. `POST /posts`, `GET /posts`, `POST /posts/:id/upvote` (Feed, basic)
25. Seed script: real, specific feed posts across a few categories
26. Available for integration support — this is when B and C swap mocks for real API calls; be responsive to bug reports

### Track B — Carpool Mobile
27. Swap mocked data for real `/rides` calls
28. Offer a Ride screen: origin, destination, time, price/seat, seats, gender preference → `POST /rides`
29. My Rides screen: Driving tab (accept/decline) + Riding tab (my requests + status) → `/rides/mine`
30. Full navigation between all Carpool screens — this is the priority polish target, spend remaining time here

### Track C — Core Mobile
31. Swap mocked Auth/Profile calls for real endpoints
32. Feed screen: list + create post + upvote (basic, no comments unless time remains)
33. Post-auth routing: new user → profile setup, returning user → Carpool browse (not Feed — Carpool is the lead feature)

**Merge everyone to `main` by end of Day 2. End of Day 2 checkpoint:** full app runs on `main`, Carpool fully clickable with real data and working filters, Feed and Auth/Profile functional.

---

## Day 3 — All hands, `main` branch only
34. Full UX pass on Carpool specifically (spacing, copy, empty states, loading states) — this is what judges will spend the most time on
35. Light UX pass on Feed/Auth/Profile so nothing looks broken
36. Replace ride seed data with final demo data — routes/prices/gender preferences that make filters obviously useful live
37. Smoke-test full flow on a clean install, at least 2 of the 3 people testing on separate devices: signup → profile → browse/filter rides → request → (other account) accept → check My Rides both sides
38. Write and rehearse the 2-minute pitch as a team — assign who talks, who drives the demo device
39. Buffer time for last-minute breakage; freeze feature work at least 2 hours before presenting

---

## Explicitly not built for the hackathon (see D-011, D-012)
- Refresh token rotation / reuse detection
- OTP rate limiting, resend cooldown, attempt lockout
- Feed comments (unless time allows), moderation/report mechanism
- Carpool: no in-app messaging, no payment handling, no background checks, no ride-in-progress tracking
- Any multi-university logic (column exists, unused)

## After the hackathon
Revert to full Auth design (D-008–D-010) and add Feed moderation (D-005) before any real launch. Carpool needs a full trust/safety/liability review before real users coordinate real rides — see D-012's revert requirement.# TASKS.md

Implementation tasks for CampusConnect.

**⚠️ Hackathon mode (2026-07-28 → deadline 2026-07-31, 3 days).** Rules relaxed per D-011/D-012. **Carpool is the primary, fully-polished demo feature. Community Feed is secondary/basic.** This reverses the earlier hackathon plan (which had Feed as primary) — see `DECISIONS.md` D-012 for why.

## Status Overview (hackathon build)

| Feature | Scope for hackathon | Status |
|---|---|---|
| Auth | Trimmed: OTP login, single JWT, no rotation/rate-limiting | ⬜ Not started |
| Profile | Trimmed: name, year, department, gender | ⬜ Not started |
| Carpool | **Full polish — main demo.** Offer/browse/request rides, filter by price/place/gender | ⬜ Not started |
| Community Feed | Basic: create post, list feed, upvote. Comments optional if time allows | ⬜ Not started |

Full production designs for Auth (D-006–D-010), Profile, and Community Feed (with moderation, D-005) remain the post-hackathon target. Carpool's hackathon design (D-012) is explicitly not production-ready — real launch needs its own safety/liability review.

---

## Day 1 — Skeleton + trimmed Auth/Profile + Carpool backend
Goal: a real person can log in, has a profile with gender set, and the Carpool API works end-to-end (testable via curl/Postman even before mobile UI exists).

**Backend — Auth & Profile**
1. Repo scaffold: FastAPI project, Postgres connection, base migration setup
2. Migration: `universities`, `users` (id, university_id, email, name, year, department, gender, created_at), `otp_requests` (id, email, code_hash, expires_at, consumed_at)
3. Seed script: one university row + several realistic test student accounts (mixed gender for filter testing)
4. `POST /auth/otp/request` — validate .edu domain, generate + email OTP
5. `POST /auth/otp/verify` — check code, create-or-fetch user, issue single long-lived JWT
6. `GET /auth/me`
7. `PATCH /profile` — update name, year, department, gender
8. `GET /profile/:id`

**Backend — Carpool**
9. Migration: `rides` (id, driver_id, university_id, origin, destination, departure_time, price_per_seat, seats_total, seats_available, gender_preference, notes, status, created_at), `ride_requests` (id, ride_id, rider_id, status, created_at, unique on ride+rider)
10. `POST /rides` — create ride offer
11. `GET /rides?origin=&destination=&max_price=&gender_pref=` — filtered browse
12. `GET /rides/:id`
13. `POST /rides/:id/request` — request a seat (server-side gender check, seat-availability check, self-request check)
14. `POST /rides/:id/requests/:reqId/accept` and `.../decline` — driver only
15. `GET /rides/mine` — driving + riding tabs
16. `POST /rides/:id/cancel`
17. Seed script: 10-15 realistic rides with varied price/route/gender_preference for demo-quality filtering

**End of Day 1 checkpoint:** full Carpool API testable end-to-end via API client; Auth/Profile working enough to get a valid token.

---

## Day 2 — Carpool mobile UX (full polish) + basic Feed
Goal: Carpool looks and feels like a real product. Feed exists and works but isn't the focus.

**Mobile — Auth/Profile**
18. Welcome + email-entry screen
19. OTP-entry screen
20. Token storage + auth context
21. Profile setup screen (name, year, department, gender)

**Mobile — Carpool (priority — spend the bulk of today here)**
22. Browse Rides screen: filter bar (price range, origin/destination search, gender preference toggle), ride cards (route, time, price, seats left, driver name)
23. Ride Detail screen: full info + Request Seat button (state-aware: disabled if full or gender-mismatched)
24. Offer a Ride screen: origin, destination, time, price/seat, seats, gender preference
25. My Rides screen: Driving tab (accept/decline requests) + Riding tab (my requests + status)
26. Navigation between all Carpool screens, consistent with rest of app

**Backend + Mobile — Feed (basic)**
27. Migration: `posts` (id, user_id, university_id, title, body, category, upvote_count, created_at)
28. `POST /posts`, `GET /posts`, `POST /posts/:id/upvote`
29. Feed screen: list + create post + upvote. Comments skipped unless time remains.
30. Seed script: real, specific posts (not placeholder text) across a few categories

**End of Day 2 checkpoint:** Carpool fully clickable end-to-end with filters working and looking polished. Feed works but is intentionally simple.

---

## Day 3 — Polish, demo data, pitch
Goal: score on UX quality (30 pts) and Pitch & Demo (25 pts).

31. Full UX pass on Carpool specifically — this is what judges will spend the most time on. Fix spacing, copy, empty states, loading states.
32. Light UX pass on Feed and Auth/Profile screens so nothing looks broken, without over-investing time here
33. Replace/expand ride seed data with final "demo data" — routes, prices, and gender preferences that make the filters obviously useful in a live demo
34. Smoke-test full flow on a clean install: signup → set profile → browse rides with filters → request a ride → (switch account) accept it → check My Rides on both sides
35. Write and rehearse the 2-minute pitch — lead with the Carpool filter demo since it's the polished flow; problem framing should center on gender-safety and price transparency in student ride-sharing
36. Reserve buffer time for last-minute breakage before presenting

---

## Explicitly not built for the hackathon (see D-011, D-012)
- Refresh token rotation / reuse detection
- OTP rate limiting, resend cooldown, attempt lockout
- Feed comments (unless time allows), moderation/report mechanism
- Carpool: no in-app messaging between driver/rider, no payment handling, no background checks, no ride-in-progress tracking
- Any multi-university logic (column exists, unused)

## After the hackathon
Revert to full Auth design (D-008–D-010) and add Feed moderation (D-005) before any real launch. Carpool specifically needs a full trust/safety/liability review before real users coordinate real rides — see D-012's revert requirement.
