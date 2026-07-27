# CLAUDE.md

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
