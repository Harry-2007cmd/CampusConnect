# TASKS.md

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
