# TASKS.md

Implementation tasks for CampusConnect. Per project rules, granular dev tasks for a feature are only added once that feature's full design (DB schema, API, UX, edge cases, security) is complete — not before.

## Status Overview

| Feature | Product Scope | DB Design | API Design | UX Design | Edge Cases | Security Review | Dev Tasks |
|---|---|---|---|---|---|---|---|
| Auth | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Profile | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Community Feed | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Carpool | Deferred to v2 | — | — | — | — | — | — |
| Search | Deferred to v2 | — | — | — | — | — | — |
| Messaging | Deferred to v2 | — | — | — | — | — | — |
| Notifications | Deferred to v2 | — | — | — | — | — | — |

## Open Decisions Blocking Design
- Mobile framework (React Native / Flutter / native) — affects API contract shape, needed before API design for Auth.
- Backend language/framework — not yet chosen.

## Next Up
Full design pass (DB → API → UX → edge cases → security → complexity estimate) for **Auth**, since Profile and Community Feed both depend on it. No dev tasks will be written until that pass is complete and reflected in this file.