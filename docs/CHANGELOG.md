# CHANGELOG.md

All notable planning and product changes to CampusConnect. Newest first.

## 2026-07-28
- Resolved both open decisions that were blocking Auth's API design.
- Logged D-006 (mobile framework: React Native + Expo) and D-007 (backend framework: FastAPI) in `DECISIONS.md`.
- Completed full design pass for Auth: DB schema, API, UX flow, edge cases, security review, complexity estimate.
- Logged D-008 (OTP verification), D-009 (passwordless login), D-010 (access+refresh tokens retained) in `DECISIONS.md`.
- Auth dev tasks written and ready for implementation — see `TASKS.md`. No code has been written yet.
- Updated `CLAUDE.md` tech stack section with concrete framework choices.

## 2026-07-27
- Initial project documentation created: `README.md`, `CLAUDE.md`, `DECISIONS.md`, `CHANGELOG.md`, `TASKS.md`.
- Reviewed initial 7-phase roadmap (Auth, Profile, Community, Carpool, Search, Messaging, Notifications) proposed by founder.
- Clarified scope: single university (for now), small team (2-4), mobile app (not website), Community Feed identified as the core hook.
- Re-prioritized MVP to Auth → Profile → Community Feed; deferred Carpool, Search, Messaging, Notifications to v2+.
- Logged decisions D-001 through D-005 in `DECISIONS.md` (email verification as trust mechanism, mobile-first architecture, MVP re-sequencing, multi-tenant-ready schema, baseline moderation in MVP).
- No code written yet. Full design (DB, API, UX, edge cases, security, complexity estimate) for MVP features still pending — tracked in `TASKS.md`.
