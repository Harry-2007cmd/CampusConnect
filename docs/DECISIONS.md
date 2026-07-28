# DECISIONS.md

Architectural and product decisions, with rationale. Newest first.

---

## D-010: Access + refresh token pattern retained despite simplicity pressure
**Date:** 2026-07-28
**Decision:** Auth issues short-lived access tokens (JWT) plus long-lived refresh tokens, with refresh token rotation on use. A single long-lived token was considered and rejected.
**Why:** The implementation cost difference is small (one extra endpoint, one extra table), while the security difference is large — same "cheap version acceptable, absent version is not" logic as D-005's moderation decision.

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
**Why:** The project is API-first with token-based mobile auth and no admin dashboard planned (explicitly out of scope per README's "don't build" list). Django's main advantages — built-in admin panel, batteries-included ORM/auth scaffolding — aren't needed here, while FastAPI's async support and lightweight footprint suit a small team building a pure API backend for a mobile client.
**Follow-up:** ORM choice (SQLAlchemy vs SQLModel) and specific database engine (Postgres assumed) still need to be confirmed during implementation.

## D-006: Mobile framework is React Native + Expo
**Date:** 2026-07-28
**Decision:** The mobile client will be built with React Native and Expo, not Flutter or native iOS/Android.
**Why:** User requirement. Resolves the open dependency flagged in D-003 — this choice unblocked Auth's API contract design (token storage approach, payload shape conventions).

## D-005: Baseline moderation is part of MVP, not deferred
**Date:** 2026-07-27
**Decision:** The Community Feed MVP must include a report/flag mechanism and manual review path from day one. It does not need automated moderation (ML classifiers, keyword filters at scale) at MVP.
**Why:** A real-name, single-campus feed with categories like Lost & Found and Buying/Selling will surface a problematic post quickly. "No moderation" is a negligence risk, not a scope cut. "Cheap manual moderation" is an acceptable MVP cut; "no moderation" is not.

## D-004: Schema will be multi-tenant-ready, but multi-university logic is out of scope
**Date:** 2026-07-27
**Decision:** Tenant-scoped tables (users, posts, etc.) will carry a `university_id` field from the first migration, even though only one university will exist as a row at MVP.
**Why:** Retrofitting tenant scoping onto an existing dataset later is a high-risk migration (data backfill, query rewrites everywhere). Adding an unused foreign key now is nearly free.

## D-003: Platform is mobile app, not website
**Date:** 2026-07-27
**Decision:** CampusConnect ships as a mobile app. Backend will be API-first; auth will be token-based (not cookie/session-based).
**Why:** User requirement. Consequence: mobile framework choice (React Native / Flutter / native) must be settled before finalizing API request/response contracts, since it can affect auth flow (e.g. token storage) and payload shape expectations.
**Resolved by:** D-006 (React Native + Expo).

## D-002: MVP is re-sequenced to Auth → Profile → Community Feed only
**Date:** 2026-07-27
**Decision:** Of the original 7-phase roadmap, only Auth, Profile, and Community Feed are in MVP. Carpool, Search, Messaging, and Notifications are deferred to v2+, contingent on the feed getting real usage.
**Why:** The original roadmap phased 7 distinct product surfaces without establishing which one justifies the app's existence. User confirmed the Community Feed is the actual hook — the other phases exist to support usage of an app people already want to open, so they don't need to ship day one. Carpool in particular was flagged as high-risk (trust/safety/liability for coordinating physical transport between strangers) and shouldn't ride in on the back of feed momentum without its own design pass.

## D-001: University email verification is a first-class design requirement, not a checkbox
**Date:** 2026-07-27
**Decision:** Auth's "Email Verification" step is specifically `.edu`(-equivalent) domain verification for the target university, and is treated as the primary trust signal for the whole app (feed posts, future carpool, future DMs all inherit trust from "verified real student").
**Why:** For a single-university social app, real-identity trust is the main safety lever available without heavier verification (ID upload, etc.). Elevating it from a generic "send a confirmation email" to a designed trust mechanism has outsized leverage on moderation and safety elsewhere.
