# DECISIONS.md

Architectural and product decisions, with rationale. Newest first.

---

## D-013: Repo folder structure + navigation library locked before Day 1 scaffolding

**Date:** 2026-07-28
**Decision:** Backend (`backend/`) uses a standard FastAPI layered layout (`models/` / `schemas/` / `services/` / `routers/`), with `services/` holding business logic (OTP generation, ride gender/seat checks) out of the router layer. Mobile (`mobile/`) uses **React Navigation** (not Expo Router) with a `services/` layer that maps 1:1 to backend routers, and a `mocks/` folder so Tracks B/C can build against mocked API shapes before Track A's endpoints are live (per the Day 1 workflow already in `TASKS.md`).
**Why:** Three people are working in parallel on separate branches (`backend`, `mobile-carpool`, `mobile-core`). The main risk isn't feature scope, it's merge conflicts on shared files. A structure where `carpool/` and `feed/` components, screens, and services are fully isolated per track means B and C almost never touch the same file. The exceptions — `navigation/RootNavigator.jsx` and `context/AuthContext.jsx` — are explicitly flagged as shared, consistent with `CLAUDE.md`'s existing "whoever finishes first merges, other rebases" rule.
**Why React Navigation over Expo Router:** explicit user choice.
**Status:** Applies to the hackathon build; can be revisited post-hackathon if the team wants file-based routing at that point.

## D-012: Carpool reactivated as primary hackathon feature; Community Feed demoted to secondary

**Date:** 2026-07-28
**Decision:** For the 3-day hackathon build only, Carpool (with filters by price, place/route, and gender preference) becomes the fully-polished, end-to-end demo feature. Community Feed is kept but trimmed to basic/functional (post + list + upvote, comments optional if time allows).
**Why:** User requirement — two features wanted for the hackathon, with Carpool prioritized as the primary demo given the 3-day constraint and rubric's reward for one fully-working polished flow (see D-011).
**Flag against D-002:** D-002 explicitly deferred Carpool to v2+ because it was assessed as high-risk — "trust/safety/liability for coordinating physical transport between strangers" — and said it "shouldn't ride in on the back of feed momentum without its own design pass." This decision does not overturn that risk assessment; it proceeds anyway for hackathon-demo purposes, with a real (if trimmed) design pass now completed. The trust/safety/liability concerns D-002 raised are real and still apply before any actual launch with real users coordinating real rides.
**Gender preference filter:** Implemented as a legitimate safety feature (common pattern in real-world carpool/rideshare apps), self-reported at the same trust level as the rest of the app's identity model (D-001). Enforced server-side on ride requests, not just client-side filtering.
**Revert requirement:** Before any real launch, Carpool needs its own full risk/safety/liability review (background checks? in-app reporting for rides? insurance/liability disclaimers?) that this hackathon design pass does not cover. Do not treat this D-012 design as production-ready.

## D-011: Hackathon scope cut for 3-day deadline

**Date:** 2026-07-28
**Decision:** For the 3-day hackathon build, the following are deliberately cut — cut, not abandoned:

- Refresh token rotation + reuse detection (D-010) → single long-lived JWT, no refresh endpoint
- OTP resend cooldown, rate limiting, attempt lockout → basic OTP flow only
- Full Profile fields (interests, skills, clubs, photo) → name, year, department, gender only (gender added for Carpool's filter, see D-012)
- Baseline moderation / report-flag mechanism (D-005) → skipped entirely
- Multi-university logic → `university_id` column kept (near-free), no logic built around it
  **Superseded in part by D-012:** originally Community Feed was the single full-polish flow; Carpool now holds that role instead, with Feed trimmed.
  **Why:** The hackathon rubric (25 Problem clarity / 20 Product completeness / 30 UX quality / 25 Pitch & Demo) rewards one fully-working, polished flow over broad but shallow feature coverage.
  **Revert requirement:** Before any real/post-hackathon launch, revert to full D-005 and D-010 scope. Applies only to the hackathon build.

## D-010: Access + refresh token pattern retained despite simplicity pressure

**Date:** 2026-07-28
**Decision:** Auth issues short-lived access tokens (JWT) plus long-lived refresh tokens, with refresh token rotation on use. A single long-lived token was considered and rejected.
**Why:** The implementation cost difference is small (one extra endpoint, one extra table), while the security difference is large — same "cheap version acceptable, absent version is not" logic as D-005's moderation decision.
**Status:** Suspended for the hackathon build only — see D-011. Applies again for any real launch.

## D-009: Login is passwordless, reusing the OTP mechanism from signup

**Date:** 2026-07-28
**Decision:** There is no password field anywhere in Auth. Both signup and login use the same email-OTP flow.
**Why:** Building a password subsystem (hashing, strength rules, forgot-password, reset-token emails) is strictly more work than one unified OTP flow, and OTP infrastructure is required anyway for D-001's email verification. Reusing it removes an entire subsystem rather than adding one.

## D-008: Email verification uses OTP codes, not magic links

**Date:** 2026-07-28
**Decision:** University email verification (D-001) is implemented as a 6-digit OTP code entered in-app, not a tappable email link.
**Why:** Magic links require correct deep-link configuration in Expo to return the user to the app; misconfiguration is a common source of bugs. OTP entry works identically regardless of device/email client and is simpler to build correctly the first time.

## D-007: Backend framework is FastAPI (Python)

**Date:** 2026-07-28
**Decision:** Backend will be built on FastAPI, not Django. Expect an async-first stack (FastAPI + SQLAlchemy/SQLModel + Pydantic schemas), with a relational database (see D-004 for multi-tenant schema requirement).
**Why:** The project is API-first with token-based mobile auth and no admin dashboard planned. Django's main advantages — built-in admin panel, batteries-included ORM/auth scaffolding — aren't needed here, while FastAPI's async support and lightweight footprint suit a small team building a pure API backend for a mobile client.
**Follow-up:** ORM choice (SQLAlchemy vs SQLModel) and specific database engine (Postgres assumed) still need to be confirmed during implementation.

## D-006: Mobile framework is React Native + Expo

**Date:** 2026-07-28
**Decision:** The mobile client will be built with React Native and Expo, not Flutter or native iOS/Android.
**Why:** User requirement. Resolves the open dependency flagged in D-003.

## D-005: Baseline moderation is part of MVP, not deferred

**Date:** 2026-07-27
**Decision:** The Community Feed MVP must include a report/flag mechanism and manual review path from day one. It does not need automated moderation at MVP.
**Why:** A real-name, single-campus feed with categories like Lost & Found and Buying/Selling will surface a problematic post quickly. "No moderation" is a negligence risk, not a scope cut.
**Status:** Suspended for the hackathon build only — see D-011. Applies again for any real launch.

## D-004: Schema will be multi-tenant-ready, but multi-university logic is out of scope

**Date:** 2026-07-27
**Decision:** Tenant-scoped tables (users, posts, rides, etc.) will carry a `university_id` field from the first migration, even though only one university will exist as a row at MVP.
**Why:** Retrofitting tenant scoping onto an existing dataset later is a high-risk migration. Adding an unused foreign key now is nearly free.

## D-003: Platform is mobile app, not website

**Date:** 2026-07-27
**Decision:** CampusConnect ships as a mobile app. Backend will be API-first; auth will be token-based (not cookie/session-based).
**Why:** User requirement.
**Resolved by:** D-006 (React Native + Expo).

## D-002: MVP is re-sequenced to Auth → Profile → Community Feed only

**Date:** 2026-07-27
**Decision:** Of the original 7-phase roadmap, only Auth, Profile, and Community Feed are in MVP. Carpool, Search, Messaging, and Notifications are deferred to v2+, contingent on the feed getting real usage.
**Why:** Community Feed is the actual hook. Carpool in particular was flagged as high-risk (trust/safety/liability for coordinating physical transport between strangers) and shouldn't ride in on the back of feed momentum without its own design pass.
**Status note:** Reactivated for hackathon-demo purposes only by D-012, which does not overturn the risk assessment above.

## D-001: University email verification is a first-class design requirement, not a checkbox

**Date:** 2026-07-27
**Decision:** Auth's "Email Verification" step is specifically `.edu`(-equivalent) domain verification for the target university, and is treated as the primary trust signal for the whole app.
**Why:** For a single-university social app, real-identity trust is the main safety lever available without heavier verification. This trust anchor now also underpins Carpool's gender-preference filter (D-012) and any future ride coordination.
