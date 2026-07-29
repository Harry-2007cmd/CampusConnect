# CHANGELOG.md

All notable planning and product changes to CampusConnect. Newest first.

## 2026-07-29 (frontend ported from mobile app to web app — D-016)

- Per user instruction, changed the frontend platform from a React Native + Expo mobile app to a browser-based web app, keeping all features and the user flow identical. Logged as D-016 (flags the reversal of D-003/D-006 rather than silently overriding them).
- Added a new `web/` directory: Vite + React + `react-router-dom`. Ported every mobile screen, component, service, context, and hook 1:1:
  - `screens/` — auth (Welcome/EmailEntry/OtpEntry), profile (ProfileSetup), carpool (BrowseRides/RideDetail/OfferRide/MyRides), feed (Feed).
  - `components/` — common (Button/TextField/ChipToggle/Loader/EmptyState), carpool (FilterBar/GenderToggle/RideCard), feed (PostCard/UpvoteButton).
  - `services/` (api/auth/post/ride — still 1:1 with backend routers), `context/AuthContext.jsx`, `hooks/` (useAuth/useRides), `theme/tokens.js` (D-014 tokens verbatim).
- Platform-specific swaps: React Navigation → `react-router-dom` (auth gating reproduced in `web/src/App.jsx`); `expo-secure-store` → `localStorage`; RN primitives → HTML/CSS; `Alert.alert` → `window.alert`; `EXPO_PUBLIC_API_URL` → `VITE_API_URL`.
- Backend untouched — it was already API-first/token-based (D-007), so the web client talks to the same `/auth`, `/profile`, `/rides`, `/posts` endpoints with no changes.
- `mobile/` left in place as historical reference (see D-016 status note). Not verified at runtime here: Node/npm is not currently on this machine (the earlier PostgreSQL/Node note in the task-26 entry notwithstanding), so `npm install` + `vite build` in `web/` still needs to be run once on a machine with Node to confirm the port compiles and boots.

## 2026-07-29 (task 26 — cross-branch integration review + bug fixes)

- Reviewed all of Day 1/1.5/Day 2 backend and mobile code against `TASKS.md`'s checked-off items to confirm the checkmarks reflect real, working code (they did) before resuming Day 2 work.
- Fixed three real bugs found during review, all in `backend/app/services/ride_service.py` and `backend/app/schemas/auth.py`:
  - `accept_request()` had a TOCTOU race: it read `seats_available`, checked it, then decremented with no row lock, so two concurrent accepts on a ride's last seat could both pass the check and oversell it. Added `SELECT ... FOR UPDATE` on the ride row (this is a safety-relevant fix, not a scope addition — the seat-availability guarantee was already required by task 13/16, just not race-safe).
  - `accept_request()`/`decline_request()` never populated `rider_name` on the returned `RideRequestOut`, unlike `request_ride()` — added a shared `_with_rider_name()` helper used by all three.
  - OTP email lookups (`otp_service.py`, `auth_service.py`, `User.email` matching) were case-sensitive with no normalization, so a differently-cased email between `/auth/otp/request` and `/auth/otp/verify` (e.g. autocapitalized by a keyboard) would silently fail OTP verification. Added a `field_validator` on `OtpRequestIn`/`OtpVerifyIn` in `schemas/auth.py` to lowercase email on input.
- Removed now-dead mock code per "no mocks should remain, everything talks to the real backend" — deleted `mobile/src/mocks/` (`auth.mock.js`, `rides.mock.js`) entirely, and removed the `USE_MOCKS` flags and dead mock imports from `authService.js`/`rideService.js` (both were already permanently `false`, this is cleanup not a behavior change). `getMe`/`updateProfile` also dropped their unused `token` parameter (the request interceptor in `api.js` already reads the token from `SecureStore`); updated the two call sites in `AuthContext.jsx` accordingly.
- Created `backend/.env` and `mobile/.env` (both gitignored) from their `.example` files for local dev. `mobile/.env`'s `EXPO_PUBLIC_API_URL` is set to the dev machine's Wi-Fi LAN IP since the team is testing on a physical phone via Expo Go (`localhost` doesn't resolve from a phone) — needs updating if the phone isn't on the same Wi-Fi network as the dev machine.
- Installed Node.js LTS (v24.18.0) on the dev machine via `winget` — verified working. PostgreSQL 17 install via `winget` failed twice (first attempt hung/stalled on the download with no network throughput and had to be killed; second attempt downloaded and hash-verified but the underlying EDB installer exited with code 1 partway through — files are present under `C:\Program Files\PostgreSQL\17` but the install isn't confirmed functional yet). **Backend is not runnable end-to-end until this is resolved** — this blocks the "run the full app today" goal, not any code correctness issue.

## 2026-07-29 (task 25 — Feed seed data)

- Backend: `scripts/seed.py` now seeds 10 demo posts (`POST_TEMPLATES`) spread across the existing seeded users, covering a few categories of campus chatter (events, marketplace, study groups, lost & found, general) as plain `content` text — no `category` field was added to the `Post` model/schema, since D-011 keeps Feed deliberately minimal. Idempotent like the existing user/ride seeding: skips if any post already exists for the university. `GET /posts` will no longer return an empty list on a fresh seed.
- Checked off task 25 in `TASKS.md`.

## 2026-07-29 (tasks 24, 32 — Feed backend + Feed screen)

- Backend (task 24): added `Post` model (`author_id`, `university_id`, `content`, `upvote_count`, `created_at` — deliberately minimal, no categories/comments/moderation per D-011), `PostCreateIn`/`PostOut` schemas, `post_service.py`, and `routers/posts.py` (`POST /posts`, `GET /posts`, `POST /posts/:id/upvote`, all thin per the router convention). `GET /posts` is public like `GET /rides`; create/upvote require auth. Upvote is a simple counter increment with no per-user dedup — consistent with D-011's "no rate limiting/abuse-prevention" hackathon cut, not a bug. Added migration `0003_posts.py` and registered the router in `main.py`.
- Mobile (task 32): added `services/postService.js` (real API only, no mocks — backend was already live when this was built), `components/feed/PostCard.jsx` + `UpvoteButton.jsx`, and `screens/feed/FeedScreen.jsx` (list + inline composer + upvote, no comments per basic scope).
- Wired `Feed` into `navigation/RootNavigator.jsx` (⚠️ shared file) and added a "Feed" entry-point button to `BrowseRidesScreen`'s header row, alongside the existing "My Rides"/"Offer a ride" buttons — Carpool remains the post-auth landing screen per D-012/D-015, Feed is reached from there.
- Not done as part of this: task 25 (seed script posts) — no demo post data exists yet, `GET /posts` will return an empty list until either seeded or posted to via the app.

## 2026-07-29 (tasks 28-29 — Offer Ride and My Rides screens)

- Added `mobile/src/screens/carpool/OfferRideScreen.jsx`: origin/destination/date/time/price/seats/gender-preference/notes form → `POST /rides`. No date-picker library is installed, so date and time are entered as two plain text fields (`YYYY-MM-DD` / `HH:MM`) and combined client-side into an ISO timestamp via `new Date(...).toISOString()`, avoiding a new native dependency mid-hackathon.
- Added `mobile/src/screens/carpool/MyRidesScreen.jsx`: Driving tab (own rides + pending/accepted/declined requests, Accept/Decline actions) and Riding tab (own requests + ride info + status) → `GET /rides/mine`, `POST /rides/:id/requests/:reqId/accept|decline`.
- Added `createRide`, `getMyRides`, `acceptRequest`, `declineRequest` to `rideService.js` (real API only — no mock equivalents needed since `USE_MOCKS` was already flipped off in task 27).
- Wired both new screens into `navigation/RootNavigator.jsx` (⚠️ shared file — flag before merging) inside the authenticated Carpool stack.
- `BrowseRidesScreen` got a header row with "My Rides" / "Offer a ride" buttons as the entry point into the two new screens — previously there was no in-app path to reach them.

## 2026-07-29 (task 31 — authService swapped off mocks)

- `mobile/src/services/authService.js`: `USE_MOCKS` flipped to `false`; `requestOtp`/`verifyOtp`/`getMe`/`updateProfile` now hit the real `/auth` and `/profile` endpoints.
- Confirmed no fallout: `EmailEntryScreen`'s `.edu` check is independent client-side validation (not the mock's), `OtpEntryScreen` has no mock-only assumptions, and the year-value and gender-value contract fixes needed for this swap were already applied (task 27's changelog entry, D-015 #7).

## 2026-07-29 (task 27 — rideService swapped off mocks)

- `mobile/src/services/rideService.js`: `USE_MOCKS` flipped to `false`; `getRides`/`getRideById`/`requestSeat` now hit the real `/rides` endpoints.
- Fixed a latent bug found while doing the swap: the file imported `api` as a default export (`import api from "./api"`), but `services/api.js` only exports it as a named export (`export const api`). Under mocks this was dead code and never surfaced; it would have thrown `Cannot read properties of undefined` on the very first real API call. Changed to `import { api } from "./api"`, matching `authService.js`.
- Also fixed a pre-existing contract bug ahead of task 31: `ProfileSetupScreen`'s `YEAR_OPTIONS` sent `year` as a string (`"1"`-`"4"`, and `"5+"`), but the backend `ProfileUpdateIn.year` is a strict `int | None` — `"5+"` can never parse as an int. Changed `YEAR_OPTIONS` values to numbers `1`-`5` so `PATCH /profile` won't 422 once Auth/Profile also swap off mocks.

## 2026-07-29 (Day 1.5 merge reconciliation applied — tasks 19.1-19.8)

- Applied the D-015 reconciliation that was decided but never actually landed in code after the three-branch merge to `main` — the raw git merge had no conflict markers, but the mobile-carpool and mobile-core foundations were left semantically incompatible (Carpool screens crashing/orphaned).
- Also fixed two merge-conflict-resolution artifacts introduced while investigating the above: `mobile/App.jsx` had a duplicated import and two concatenated top-level JSX return blocks (invalid JSX — both sides of a conflict kept instead of one chosen); `mobile/app.json` had a duplicate `ios` key and a missing comma (invalid JSON, same cause).
- `theme/tokens.js`: added nested `typography.size.*` mirroring the flat keys, matching D-015 #1.
- `components/common/Button.jsx`: now accepts `title` or `label`.
- `components/common/Loader.jsx`: now accepts an optional `label` under the spinner.
- `components/common/EmptyState.jsx`: now accepts an optional `tone` prop (`"error"` tints the title).
- `navigation/RootNavigator.jsx`: merged Carpool's `BrowseRides`/`RideDetail` stack in; post-auth routing now sends a complete profile to `BrowseRides` instead of the retired `MainPlaceholderScreen` (closes task 33). Deleted `screens/MainPlaceholderScreen.jsx` (unused after the merge).
- Fixed the three cross-track data-contract bugs from D-015 #7: `ProfileSetupScreen` gender values (`male`/`female`/`other`, not `woman`/`man`), `rideService.js` omits `gender_pref` when the filter is `"any"` instead of sending it literally, `mocks/rides.mock.js` `status` uses `"active"` not `"open"`.
- Updated `TASKS.md` to check off 19.1-19.8.

## 2026-07-28 (Carpool mobile scaffold + Browse/Detail screens — tasks 18-19)

- First code in the repo. Scaffolded the `mobile/` Expo + React Navigation project (package.json, app.json, babel.config.js, App.jsx) since no mobile code existed yet — required to make tasks 18-19 runnable, not just isolated components.
- Built `src/theme/tokens.js` implementing the D-014 color/spacing/typography/radius tokens verbatim from `docs/DESIGN.md`.
- Built shared `components/common/` (`Button`, `Loader`, `EmptyState`) implementing the required loading/empty/error states from `DESIGN.md`, reused across Browse Rides and Ride Detail.
- Built `components/carpool/` (`RideCard`, `FilterBar`, `GenderToggle`) and `screens/carpool/` (`BrowseRidesScreen`, `RideDetailScreen`).
- Added `src/mocks/rides.mock.js` matching task 11/12's documented `GET /rides` / `GET /rides/:id` response shape, and `src/services/rideService.js` mirroring the future `routers/rides.py` 1:1 (mock-backed now, one-file swap when Track A's API is live).
- Touched two files outside `carpool/` that are flagged shared with Track C: created `src/navigation/RootNavigator.jsx` (Carpool-only stack for now — confirmed with the user before writing) and left `context/AuthContext.jsx` untouched (screens don't need auth yet since they run on mocked data).
- Added a root `.gitignore` (didn't exist) to exclude `node_modules/`, `.expo/`, `.env`.

## 2026-07-28 (shared UI/UX design system added)

- Identified a gap: Day 1 planning covered screen inventory, component boundaries, and a Day 3 polish task, but no actual shared visual language (colors, spacing, typography, corner radius) existed — risk of Carpool and Feed/Auth/Profile screens visually diverging across the two parallel mobile branches.
- Created `docs/DESIGN.md`: color roles, typography scale, single spacing scale (4/8/12/16/24/32), corner-radius rules, and required loading/empty/error states for async screens.
- Chose **warm & friendly** as the visual direction (rounded, approachable, campus-community feel) — user decision.
- Logged as D-014 in `DECISIONS.md`.
- Updated `CLAUDE.md` (hackathon banner + Tech Stack + Conventions) to reference `docs/DESIGN.md` as required reading before building any screen.
- Updated `TASKS.md`: added task 17.5 (both mobile tracks confirm they've read the design tokens before starting screens 18-23), and a note on task 34 that Day 3 polish should be refinement, not retrofitting, since tokens are applied from Day 1.

## 2026-07-28 (repo structure + navigation library locked)

- Reviewed a proposed MERN + Google Maps folder structure against the actual stack; confirmed it didn't match D-006/D-007 and wasn't adopted.
- Designed and confirmed a FastAPI backend structure (`models/schemas/services/routers`) and a React Native mobile structure (feature-grouped `screens/`/`components/` by track, `services/` mirroring backend routers, `mocks/` for pre-integration development).
- Chose **React Navigation** over Expo Router.
- Logged as D-013. Flagged the two genuinely shared mobile files (`RootNavigator.jsx`, `AuthContext.jsx`) for merge coordination.
- Added the structure to `TASKS.md` (new "Repo Structure" section) and populated `CLAUDE.md`'s previously-empty `## Conventions` section.

## 2026-07-28 (Carpool reactivated as primary hackathon feature)

- User requested two hackathon features: Carpool (with price/place/gender filters) and Community Feed.
- Flagged conflict with D-002 (Carpool was deferred to v2+ as high-risk, needing its own design pass) before proceeding — logged as D-012 rather than silently overridden.
- Given the 3-day constraint, user chose Carpool as the fully-polished primary demo feature; Community Feed demoted to basic/functional.
- Completed a trimmed design pass for Carpool: DB schema (`rides`, `ride_requests`, `users.gender`), API, UX flow, edge cases, security notes.
- Added `gender` field to the hackathon Profile scope to support the filter.
- Rewrote `TASKS.md`'s 3-day plan: Day 1 skeleton + trimmed Auth/Profile + Carpool backend, Day 2 Carpool mobile UX + basic Feed, Day 3 polish + demo data + pitch.
- No code has been written yet.

## 2026-07-28 (hackathon scope cut)

- Learned of a 3-day hackathon deadline with a published rubric (25 Problem clarity / 20 Product completeness / 30 UX quality / 25 Pitch & Demo, 100 pts total).
- Re-scoped the build around the rubric. Logged D-011: refresh token rotation, OTP abuse-prevention edge cases, full profile fields, and moderation cut for the hackathon build only.

## 2026-07-28

- Resolved both open decisions blocking Auth's API design. Logged D-006 (React Native + Expo) and D-007 (FastAPI).
- Completed full design pass for Auth: DB schema, API, UX flow, edge cases, security review, complexity estimate.
- Logged D-008 (OTP verification), D-009 (passwordless login), D-010 (access+refresh tokens).
- Auth dev tasks written and ready for implementation.

## 2026-07-27

- Initial project documentation created: `README.md`, `CLAUDE.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`.
- Clarified scope: single university (for now), small team (2-4), mobile app (not website), Community Feed identified as the core hook.
- Re-prioritized MVP to Auth → Profile → Community Feed; deferred Carpool, Search, Messaging, Notifications to v2+.
- Logged decisions D-001 through D-005.
- No code written yet.
