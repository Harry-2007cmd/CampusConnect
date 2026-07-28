# CLAUDE.md

Context for AI-assisted development on CampusConnect. Read this before writing any code.

## ⚠️ Hackathon mode active (2026-07-28 → 2026-07-31), team of 3

This project has a 3-day hackathon deadline judged on a rubric (Problem clarity 25, Product completeness 20, UX quality 30, Pitch & Demo 25). Per D-011/D-012 in `DECISIONS.md`, **Carpool (with price/place/gender filters) is the primary, fully-polished demo feature. Community Feed is intentionally basic.** Auth and Profile are trimmed support scaffolding. Do not "fix" trimmed scope by adding back rotation, rate limiting, moderation, or extra fields unless explicitly asked. Do not remove the server-side gender-preference check on ride requests — that's a deliberate safety mechanism. Before building any screen, read `docs/DESIGN.md` (D-014) — it's the shared color/spacing/typography/component baseline for both mobile tracks. Don't hardcode colors, spacing, or corner radii per-screen; use the tokens defined there.

**Three people are working in parallel on three branches** — `backend`, `mobile-carpool`, `mobile-core` — each running their own Claude Code session against this same `TASKS.md`. If you're running in one of these branches:

- Only work the tasks assigned to your track in `TASKS.md`. Don't implement another track's tasks even if it seems faster — it'll conflict at merge time.
- If you're on `mobile-carpool` or `mobile-core` and the backend endpoint you need isn't live yet, build against the request/response shape documented in the Track A task list and mock it (in `src/mocks/`), rather than blocking.
- Flag in your task-completion summary which files you touched outside your obvious scope (e.g. shared navigation config, shared type definitions) so the human can coordinate a merge.
- The repo structure (see `TASKS.md` and D-013) deliberately isolates `carpool/` and `feed/` folders per track. The two known shared files are `mobile/src/navigation/RootNavigator.jsx` and `mobile/src/context/AuthContext.jsx` — flag any edits to these in your team chat _before_ merging, not after.

## Project Summary

CampusConnect is a mobile app for students at a single university. Long-term MVP = Auth + Profile + Community Feed. Current hackathon build also includes Carpool as the lead feature. See `README.md` for full scope and `DECISIONS.md` for why things are the way they are.

## Ground Rules

- **Do not start implementation until planning is marked complete** in `TASKS.md` for the feature in question. **Suspended for the hackathon build** — see D-011/D-012; all four features are being worked from deliberately trimmed specs.
- **Documentation is the source of truth.** Before changing behavior, check `DECISIONS.md`. If a change contradicts a logged decision, flag it — don't silently override it.
- Whenever a feature is added, modified, or removed: update the affected docs (`README.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`) as part of the same change.
- **No code has been written yet as of 2026-07-28.**

## Tech Stack

- **Client:** React Native + Expo (D-006), navigation via **React Navigation**, not Expo Router (D-013).
- **Backend:** Python, FastAPI, async-first. SQLAlchemy/SQLModel + Pydantic; Postgres (D-007).
- **API style:** API-first, token-based auth. **Hackathon build:** single long-lived JWT, no refresh endpoint (D-011).
- **Auth model:** Passwordless. Email OTP for verification and login (D-008, D-009). **Hackathon build:** no rate limiting, resend cooldown, or attempt lockout.
- **Database:** relational, `university_id` on tenant-scoped tables, unused at MVP (D-004). `users.gender` added for Carpool's filter (D-012).
- **Design system:** shared color/spacing/typography/component tokens defined in `docs/DESIGN.md` (D-014) — "warm & friendly" direction, applies to both mobile tracks.

## Conventions

**Backend (`backend/`) — layered FastAPI structure:**
backend/
├── app/
│ ├── main.py
│ ├── config.py
│ ├── database.py
│ ├── deps.py # get_db, get_current_user
│ ├── core/
│ │ ├── security.py # JWT encode/decode
│ │ └── errors.py
│ ├── models/ # SQLAlchemy/SQLModel tables
│ ├── schemas/ # Pydantic request/response shapes
│ ├── services/ # business logic (OTP gen, ride gender/seat checks) — keep this out of routers
│ └── routers/ # thin — validate input, call services, return schema
├── migrations/ # alembic
├── scripts/seed.py
└── tests/
Rule of thumb: routers stay thin (parse request → call a service → return). Anything with an `if` statement checking business rules (gender match, seat availability, self-request) belongs in `services/`, not the router — this is where task 13's gender-preference check and seat-availability check live, and where a security reviewer should look first.

**Mobile (`mobile/`) — React Navigation, feature-grouped:**
mobile/
├── src/
│ ├── screens/
│ │ ├── auth/ # Track C
│ │ ├── profile/ # Track C
│ │ ├── carpool/ # Track B
│ │ └── feed/ # Track C
│ ├── components/
│ │ ├── common/ # shared: Button, Loader, EmptyState
│ │ ├── carpool/
│ │ └── feed/
│ ├── navigation/RootNavigator.jsx # ⚠️ shared — see coordination note above
│ ├── context/AuthContext.jsx # ⚠️ shared — see coordination note above
│ ├── services/ # api.js + one file per resource, 1:1 with backend routers
│ ├── mocks/ # mocked responses matching Track A's documented shapes
│ └── hooks/
`services/` files should mirror backend routers 1:1 (`rideService.js` ↔ `routers/rides.py`) so swapping a mock for a real call is a one-file change.

All mobile screens/components pull colors, spacing, and corner radii from the tokens in `docs/DESIGN.md` (D-014) rather than hardcoding values — this applies equally to Track B (`carpool/`) and Track C (`auth/`, `profile/`, `feed/`) so the app doesn't visually fork between tracks.

See D-013 for the reasoning (parallel-branch merge-conflict avoidance) and why React Navigation was chosen over Expo Router.

## Current Focus

3-day hackathon build, 3-person team working in parallel branches (`backend`, `mobile-carpool`, `mobile-core`). See `TASKS.md` for the full Day 1/2/3 breakdown by track. **Carpool is the priority feature** — full polish, filters (price/place/gender) working end-to-end. Community Feed is basic/functional only.