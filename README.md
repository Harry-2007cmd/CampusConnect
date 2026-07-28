# CampusConnect

A mobile-first networking app for a single university, connecting students across years and departments.

## Status

🛠️ **Hackathon build in progress — 3-day deadline (2026-07-28 → 2026-07-31).** Judged on a rubric: Problem clarity (25), Product completeness (20), UX quality (30), Pitch & Demo (25). For this build, **Carpool is the fully-polished, primary demo feature** (filters by price, place, and gender preference); Community Feed is basic/functional; Auth and Profile are trimmed scaffolding. See `DECISIONS.md` D-011 and D-012. Full production design for Auth/Profile/Feed exists in `DECISIONS.md` and is the target after the hackathon; Carpool's hackathon design is explicitly not production-ready and needs a full safety/liability review before real use.

## Product Vision

CampusConnect helps students at one university discover and connect with each other across year groups and departments — starting with a shared community feed, with networking-adjacent features (carpool, messaging, search) layered in once the core feed proves useful.

## Scope (current — long-term product)

- **Platform:** Mobile app (not a website). Backend will be API-first to support this.
- **Audience:** Students at a single university, for now. Schema will be designed to support multiple universities later without a rewrite, but multi-campus logic is explicitly out of scope for now.
- **Team:** Small team (2-4 people).

## The Hook (long-term product)

The core reason this app exists: **a Reddit-style community feed** for the university (posts, upvotes, comments, tagged categories like Academics, Placements, Lost & Found, Hostel, Events, etc.). Everything else in the roadmap exists to support or extend this.

## MVP (revised, long-term)

**In MVP:**

1. Auth (registration, login, university email verification)
2. Student Profile (name, year, department, interests, skills, clubs, photo)
3. Community Feed (posts, upvotes, comments, tags/categories, basic reporting/moderation)

**Explicitly deferred (v2+, only if MVP gets traction):**

- Carpool, Global search, Messaging, Notifications

**Explicitly out of scope (per original "don't build" list):**

- AI chatbot, recommendation engine, video/voice calls, live location sharing, payment gateway, admin analytics dashboards, microservices, Kubernetes, Docker Swarm.

## Hackathon build (current, overrides above priority order — see D-012)

For the 3-day hackathon specifically:

1. **Carpool — primary, fully polished.** Offer/browse/request rides with filters for price, place, and gender preference.
2. **Community Feed — basic.** Create post, list, upvote.
3. **Auth / Profile — trimmed scaffolding** to support the above (OTP login, minimal profile fields incl. gender).

This is a deliberate hackathon-only reprioritization (D-012), not a change to the long-term MVP order above. Carpool was originally deferred as high-risk (trust/safety/liability) and needs its own real design pass before any actual launch — the hackathon build is a demo, not a production version.

## Documentation Map

- `README.md` — this file, project overview and current scope
- `CLAUDE.md` — technical context and conventions for AI-assisted development
- `DECISIONS.md` — architectural and product decisions with rationale
- `CHANGELOG.md` — chronological log of what changed and when
- `TASKS.md` — implementation task breakdown (currently the 3-day hackathon plan, Carpool-first)# CampusConnect

A mobile-first networking app for a single university, connecting students across years and departments.

## Status

📋 **Planning phase.** No code has been written yet. Product and technical design is happening first — see `DECISIONS.md` and `TASKS.md`.

## Product Vision

CampusConnect helps students at one university discover and connect with each other across year groups and departments — starting with a shared community feed, with networking-adjacent features (carpool, messaging, search) layered in once the core feed proves useful.

## Scope (current)

- **Platform:** Mobile app (not a website). Backend will be API-first to support this.
- **Audience:** Students at a single university, for now. Schema will be designed to support multiple universities later without a rewrite, but multi-campus logic is explicitly out of scope for now.
- **Team:** Small team (2-4 people).

## The Hook

The core reason this app exists: **a Reddit-style community feed** for the university (posts, upvotes, comments, tagged categories like Academics, Placements, Lost & Found, Hostel, Events, etc.). Everything else in the roadmap exists to support or extend this.

## MVP (revised)

The original roadmap listed 7 phases (Auth → Profile → Community → Carpool → Search → Messaging → Notifications). We've re-sequenced this: the true MVP is the smallest thing needed to prove the feed has value.

**In MVP:**

1. Auth (registration, login, university email verification)
2. Student Profile (name, year, department, interests, skills, clubs, photo)
3. Community Feed (posts, upvotes, comments, tags/categories, basic reporting/moderation)

**Explicitly deferred (v2+, only if MVP gets traction):**

- Carpool
- Global search (students/clubs/posts/rides)
- Messaging
- Notifications

**Explicitly out of scope (per original "don't build" list):**

- AI chatbot, recommendation engine, video/voice calls, live location sharing, payment gateway, admin analytics dashboards, microservices, Kubernetes, Docker Swarm.

## Documentation Map

- `README.md` — this file, project overview and current scope
- `CLAUDE.md` — technical context and conventions for AI-assisted development
- `DECISIONS.md` — architectural and product decisions with rationale
- `CHANGELOG.md` — chronological log of what changed and when
- `TASKS.md` — implementation task breakdown (populated once a feature's full design — DB, API, UX, security, edge cases — is complete)
