# TASKS.md

Implementation tasks for CampusConnect.

**⚠️ Hackathon mode (2026-07-28 → deadline 2026-07-31, 3 days). Team of 3, working in parallel.** Rules relaxed per D-011/D-012. **Carpool is the primary, fully-polished demo feature. Community Feed is secondary/basic.**

## Team Split & Git Workflow

| Track              | Person     | Branch           | Owns                                                     |
| ------------------ | ---------- | ---------------- | -------------------------------------------------------- |
| A — Backend        | **\_\_\_** | `backend`        | All FastAPI endpoints, DB migrations, seed scripts       |
| B — Carpool Mobile | **\_\_\_** | `mobile-carpool` | Browse/filter, ride detail, offer-ride, my-rides screens |
| C — Core Mobile    | **\_\_\_** | `mobile-core`    | Auth/OTP screens, profile setup, feed screens            |

**Workflow:**

- Branch off `main` at the start. Each person runs their own Claude Code session in their own branch/worktree, all pointed at this same `TASKS.md` and `CLAUDE.md`.
- B and C build against the API contracts already specified below (endpoint + request/response shape) using mocked responses — don't wait idle for A to finish.
- Both B and C build screens against the shared design tokens in `docs/DESIGN.md` (D-014) — confirm you've both read it before starting tasks 18-23, so Carpool and Feed/Auth/Profile don't visually diverge.
- **Merge checkpoints:** end of Day 1 (backend API should be real and mergeable), midday Day 2 (swap mocks for real calls), end of Day 2 (everything integrated on `main`), Day 3 is `main`-only, no more branch work.
- If two people touch the same file (e.g. navigation setup), whoever finishes first merges to `main` and the other rebases — flag it in your team chat before it happens, not after.

## Repo Structure (D-013)

Task 1 (backend scaffold) and tasks 18-23 (mobile scaffold) should produce this layout. It's designed around the parallel-branch workflow above: `carpool/` and `feed/` folders are isolated per track so B and C rarely touch the same file. Only `navigation/RootNavigator.jsx` and `context/AuthContext.jsx` are shared — flag edits to these before merging.
backend/ # Track A
├── app/
│ ├── main.py
│ ├── config.py
│ ├── database.py
│ ├── deps.py # get_db, get_current_user
│ ├── core/
│ │ ├── security.py # JWT encode/decode
│ │ └── errors.py
│ ├── models/ # user.py, university.py, otp.py, ride.py, ride_request.py, post.py
│ ├── schemas/ # auth.py, profile.py, ride.py, post.py
│ ├── services/ # otp_service.py, auth_service.py, ride_service.py — business logic lives here
│ └── routers/ # auth.py, profile.py, rides.py, posts.py — stay thin
├── migrations/ # alembic
├── scripts/seed.py
├── tests/
├── .env
└── requirements.txt

mobile/
├── src/
│ ├── screens/
│ │ ├── auth/ # Track C: Welcome, EmailEntry, OtpEntry
│ │ ├── profile/ # Track C: ProfileSetup
│ │ ├── carpool/ # Track B: Browse, RideDetail, OfferRide, MyRides
│ │ └── feed/ # Track C: FeedList, CreatePost
│ ├── components/
│ │ ├── common/ # shared: Button, Loader, EmptyState
│ │ ├── carpool/ # RideCard, FilterBar, GenderToggle
│ │ └── feed/ # PostCard, UpvoteButton
│ ├── navigation/
│ │ └── RootNavigator.jsx # ⚠️ shared file — coordinate before merging
│ ├── context/
│ │ └── AuthContext.jsx # ⚠️ shared file — Track C owns, Track B reads
│ ├── services/ # api.js (axios + JWT interceptor), authService.js, rideService.js, postService.js
│ │ # each maps 1:1 to a backend router — swap mock for real call in one file
│ ├── mocks/ # rides.mock.js, posts.mock.js — matches Track A's documented shapes
│ ├── hooks/ # useAuth.js, useRides.js
│ └── App.jsx
├── assets/
├── .env
├── app.json
└── package.json

Navigation library: **React Navigation** (not Expo Router) — see D-013.
Design tokens (color/type/spacing/radius/component states): see `docs/DESIGN.md` — D-014.

## Status Overview (hackathon build)

| Feature        | Scope for hackathon                                       | Track                    |
| -------------- | --------------------------------------------------------- | ------------------------ |
| Auth           | Trimmed: OTP login, single JWT, no rotation/rate-limiting | A (backend) + C (mobile) |
| Profile        | Trimmed: name, year, department, gender                   | A (backend) + C (mobile) |
| Carpool        | **Full polish — main demo.** Filter by price/place/gender | A (backend) + B (mobile) |
| Community Feed | Basic: create post, list, upvote                          | A (backend) + C (mobile) |

---

## Day 1

### Track A — Backend (do this first, others depend on it)

1. Repo scaffold: FastAPI project (following Repo Structure above), Postgres connection, base migration setup
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

### Track B & C — shared, before screens

17.5. Both mobile tracks read `docs/DESIGN.md` (D-014) and confirm the color/spacing/typography/component-state tokens before starting any screen in tasks 18-23. If either track wants to deviate, flag it in team chat first — don't fork the design silently.

### Track B — Carpool Mobile (build against mocked API first)

18. Browse Rides screen: filter bar (price range, origin/destination text, gender preference toggle), ride cards — use mocked ride list matching task 11's shape (from `src/mocks/rides.mock.js`)
19. Ride Detail screen: full info + Request Seat button — mocked data first

### Track C — Core Mobile (build against mocked API first)

20. Welcome + email-entry screen
21. OTP-entry screen
22. Token storage + auth context (real logic in `context/AuthContext.jsx`, just point at mocked/local responses until A's endpoints are live)
23. Profile setup screen (name, year, department, gender)

**End of Day 1 checkpoint:** A's full API is real and testable via curl/Postman. B and C have working screens against mocked data, ready to swap in real calls.

---

## Day 2

### Track A — Backend

24. `POST /posts`, `GET /posts`, `POST /posts/:id/upvote` (Feed, basic)
25. Seed script: real, specific feed posts across a few categories
26. Available for integration support — this is when B and C swap mocks for real API calls; be responsive to bug reports

### Track B — Carpool Mobile

27. Swap mocked data in `rideService.js` for real `/rides` calls
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

34. Full UX pass on Carpool specifically (spacing, copy, empty states, loading states) — this is what judges will spend the most time on. Should mostly be refinement, not retrofitting, since `docs/DESIGN.md` states/tokens were applied from Day 1.
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
- Full brand identity, icon set, illustration style, dark mode, motion spec (see D-014 scope note in `docs/DESIGN.md`)

## After the hackathon

Revert to full Auth design (D-008–D-010) and add Feed moderation (D-005) before any real launch. Carpool needs a full trust/safety/liability review before real users coordinate real rides — see D-012's revert requirement.