# DECISIONS.md

Architectural and product decisions, with rationale. Newest first.

---

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
**Open follow-up:** Mobile framework not yet chosen.

## D-002: MVP is re-sequenced to Auth → Profile → Community Feed only
**Date:** 2026-07-27
**Decision:** Of the original 7-phase roadmap, only Auth, Profile, and Community Feed are in MVP. Carpool, Search, Messaging, and Notifications are deferred to v2+, contingent on the feed getting real usage.
**Why:** The original roadmap phased 7 distinct product surfaces without establishing which one justifies the app's existence. User confirmed the Community Feed is the actual hook — the other phases exist to support usage of an app people already want to open, so they don't need to ship day one. Carpool in particular was flagged as high-risk (trust/safety/liability for coordinating physical transport between strangers) and shouldn't ride in on the back of feed momentum without its own design pass.

## D-001: University email verification is a first-class design requirement, not a checkbox
**Date:** 2026-07-27
**Decision:** Auth's "Email Verification" step is specifically `.edu`(-equivalent) domain verification for the target university, and is treated as the primary trust signal for the whole app (feed posts, future carpool, future DMs all inherit trust from "verified real student").
**Why:** For a single-university social app, real-identity trust is the main safety lever available without heavier verification (ID upload, etc.). Elevating it from a generic "send a confirmation email" to a designed trust mechanism has outsized leverage on moderation and safety elsewhere.
