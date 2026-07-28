# CLAUDE.md

Context for AI-assisted development on CampusConnect. Read this before writing any code.

## Project Summary
CampusConnect is a mobile app for students at a single university. MVP = Auth + Profile + Community Feed (Reddit-style). See `README.md` for full scope and `DECISIONS.md` for why things are the way they are.

## Ground Rules
- **Do not start implementation until planning is marked complete** in `TASKS.md` for the feature in question. Planning includes: DB schema, API design, UX flow, edge cases, and security review — not just a feature description.
- **Documentation is the source of truth.** Before changing behavior, check `DECISIONS.md` for whether that behavior was an intentional decision. If a change contradicts a logged decision, flag it — don't silently override it.
- Whenever a feature is added, modified, or removed: update the affected docs (`README.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`) as part of the same change, not as a follow-up.
- **No code has been written yet as of 2026-07-28.** Auth is the first feature with a complete design and dev task breakdown (see `TASKS.md`) and is the intended starting point for implementation.

## Tech Stack
- **Client:** React Native + Expo (D-006).
- **Backend:** Python, FastAPI, async-first. Likely SQLAlchemy/SQLModel + Pydantic; database engine assumed Postgres, pending confirmation during implementation (D-007).
- **API style:** API-first, no server-rendered pages, token-based auth — access + refresh JWT pattern, not cookie/session-based (D-003, D-010).
- **Auth model:** Passwordless. Email OTP for both verification and login, no password field anywhere (D-008, D-009).
- **Database:** relational, schema designed to support future multi-university expansion via a `university_id` on tenant-scoped tables, even though only one university is live at MVP (D-004).

## Conventions
(To be populated once first code is written — naming conventions, folder structure, testing approach, etc.)

## Current Focus
Auth is fully designed (DB, API, UX, edge cases, security) and ready for implementation — see `TASKS.md` for the 13 dev tasks. Profile is the next feature to receive a design pass. Community Feed design has not started.# CLAUDE.md

Context for AI-assisted development on CampusConnect. Read this before writing any code.

## Project Summary
CampusConnect is a mobile app for students at a single university. MVP = Auth + Profile + Community Feed (Reddit-style). See `README.md` for full scope and `DECISIONS.md` for why things are the way they are.

## Ground Rules
- **Do not start implementation until planning is marked complete** in `TASKS.md` for the feature in question. Planning includes: DB schema, API design, UX flow, edge cases, and security review — not just a feature description.
- **Documentation is the source of truth.** Before changing behavior, check `DECISIONS.md` for whether that behavior was an intentional decision. If a change contradicts a logged decision, flag it — don't silently override it.
- Whenever a feature is added, modified, or removed: update the affected docs (`README.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`) as part of the same change, not as a follow-up.

## Tech Stack
**Status: not yet finalized.** Known constraints so far:
- Client: mobile app (not a website) — framework choice (React Native / Flutter / native) still open, needed before API contract design is finalized.
- Backend: must be API-first (no server-rendered pages), token-based auth (not cookie/session-based, since mobile clients can't rely on browser cookies).
- Database: relational, schema designed to support future multi-university expansion via a `university_id` on tenant-scoped tables, even though only one university is live at MVP.

This section will be updated with concrete choices once made — see `DECISIONS.md`.

## Conventions
(To be populated once first code is written — naming conventions, folder structure, testing approach, etc.)

## Current Focus
Planning MVP: Auth, Profile, Community Feed. See `TASKS.md` for status.
