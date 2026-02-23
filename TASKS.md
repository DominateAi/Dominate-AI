# Dominate AI — Master Task List

> Track all engineering, OSS, and product tasks across sessions.
> Format: `- [ ]` = pending · `- [x]` = done · add `[session N]` tag when completed.

---

## Legend
- 🔴 Critical / Security
- 🟠 High priority
- 🟡 Medium priority
- 🟢 Low / Nice to have
- 🏗️ Architecture change
- 🐛 Bug fix
- 📱 Mobile
- 🔒 Security
- 🌍 OSS / Community
- 📖 Docs
- ⚙️ DevOps / CI

---

## 1 · Multi-Tenant → Self-Hostable Migration 🏗️

### Frontend
- [ ] 🟠 Remove subdomain-based workspace detection from `config.js` — replace with `REACT_APP_WORKSPACE_ID` env var defaulting to `"default"`
- [ ] 🟠 Remove dynamic URL construction from `config.js` — replace with single `REACT_APP_API_URL` env var
- [ ] 🟠 Remove super-admin workspace management routes from `App.js` (`/create-`, `/create--workspace`)
- [ ] 🟠 Remove `src/components/super-admin/` folder (workspace creation / cross-tenant user management)
- [ ] 🟡 Simplify `enterprizeAccount.json` workspace list checks — assume single-workspace mode always
- [ ] 🟠 Simplify `WorkSpaceLogin.js` — remove `workspaceName` extraction from URL on form submit; use fixed workspace ID
- [ ] 🟠 Remove `AddOrganization` as a signup step — self-hosted mode has one org; signup just creates a user

### Backend
- [ ] 🟠 Introduce `DEFAULT_WORKSPACE_ID` env var — routes that require `workspaceId` fall back to this
- [ ] 🔴 Remove workspace-per-database switching in `passport.js` — simplify to single MongoDB database
- [ ] 🟠 Remove `api/routes/SuperAdmin.route.js` — workspace provisioning not needed in self-hosted mode
- [ ] 🟡 Replace `/public/workspace/exist` with a simple `/health` endpoint
- [ ] 🟠 Create first-run setup wizard — on empty DB, auto-create default org + prompt admin to set credentials

---

## 2 · Bug Fixes 🐛

- [ ] 🔴 Fix signup flow stuck at password + confirm-password step — trace `onSubmitHandler` and step-advance logic in `SignUpFormFilds.js`; likely a validation error being swallowed
- [ ] 🟠 Add `/public/getallroles/open` backend route (or expose existing `/api/roles` publicly) — roles dropdown on signup is empty
- [ ] 🟠 Reconcile `/public/userinworkspace/exist` — either add missing backend route or align frontend to call the correct endpoint
- [ ] 🟠 Fix `mobile-new/auth/SignUpFormFilds.js` — apply same signup bug fixes as desktop version
- [ ] 🟠 Fix `WorkSpaceLogin.js` crash when `localStorage("Data")` is null — `data.tokenExpiresOn` accessed without null guard

---

## 3 · Mobile & Tablet Dark UI Theme 📱

- [ ] 🟠 Audit desktop dark theme SCSS variables — extract colour palette into a shared `_dark-vars.scss`
- [ ] 🟠 Create `src/assets/scss/mobileAll/_dark-theme-mobile.scss` mirroring desktop dark palette
- [ ] 🟠 Apply dark theme to `mobile-new` auth screens (login + signup)
- [ ] 🟠 Apply dark theme to mobile dashboard (`mobile-new/dashboard/` + `mobile/dashboard/`)
- [ ] 🟠 Apply dark theme to mobile navbar (top navbar + hamburger menu)
- [ ] 🟡 Apply dark theme to mobile leads, customers, employees, tasks views
- [ ] 🟡 Apply dark theme to mobile settings and plans views
- [ ] 🟡 Test on key breakpoints — 375px, 414px, 768px, 1024px
- [ ] 🟡 Fix tablet layout — `windowWidth <= 767` check in `App.js` cuts off 768px tablets; ensure they get desktop or a proper tablet layout

---

## 4 · Security Fixes 🔒

- [ ] 🔴 Move Stripe publishable keys out of `config.js` → `REACT_APP_STRIPE_TEST_KEY` / `REACT_APP_STRIPE_LIVE_KEY` env vars
- [ ] 🔴 Replace hardcoded `"server_secert": "dev"` JWT secret in `backend/config/env/dev.json` → `process.env.JWT_SECRET`
- [ ] 🔴 Remove hardcoded system JWT token from `dev.json` → env var
- [ ] 🔴 Move MinIO credentials out of `dev.json` → `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` env vars
- [ ] 🔴 Audit `config/database.js` for hardcoded MongoDB connection strings → env vars
- [ ] 🔴 Switch auth token storage from `localStorage` to `httpOnly; Secure; SameSite=Strict` cookies — removes XSS vulnerability
- [ ] 🟠 Add `express-rate-limit` to `/public/login`, `/public/signup`, `/public/forgotPassword`
- [ ] 🟠 Add `helmet.js` middleware to backend for secure HTTP headers
- [ ] 🟠 Add `express-mongo-sanitize` to sanitise all POST bodies against NoSQL injection
- [ ] 🟠 Validate workspace access server-side in passport strategy before switching DB context
- [ ] 🟠 Audit `backend/config/cors.js` — ensure it is not `origin: "*"` in production; lock to `ALLOWED_ORIGIN` env var
- [ ] 🟡 Add CSRF protection (e.g. `csrf` package) once cookie-based auth is in place
- [ ] 🟡 Audit Socket.io connection — verify auth token is validated on socket handshake
- [ ] 🟠 Create `.env.example` for both `frontend/` and `backend/` documenting every required variable
- [ ] 🟠 Add startup env-var validation in backend — fail fast with a clear error if required vars are missing

---

## 5 · Frontend Modernisation

- [ ] 🟠 Upgrade React 16 → 18 — audit deprecated lifecycle methods; convert class components to hooks where needed
- [ ] 🟠 Upgrade React Router v5 → v6 — `Switch`→`Routes`, `Redirect`→`Navigate`, `useHistory`→`useNavigate`
- [ ] 🟠 Introduce Redux Toolkit — replace boilerplate action creators + reducers with `createSlice`
- [ ] 🟠 Upgrade Redux 4 → 5
- [ ] 🟠 Upgrade Axios 0.21 → 1.x — update error handling and interceptors
- [ ] 🟡 Replace `moment.js` with `date-fns` v3 or `dayjs` across frontend
- [ ] 🟡 Upgrade Material-UI v4 → MUI v5/v6 (`@mui/material`)
- [ ] 🟡 Replace Sass `@import` with `@use` / `@forward` — eliminates 377 deprecation warnings on every compile
- [ ] 🟡 Remove unused `next.js` dependency and all `@zeit/next-*` packages from `frontend/package.json`
- [ ] 🟠 Remove server-side-only packages (`express`, `body-parser`, `cors`, `cookie-parser`, `express-session`) from frontend `package.json` — belong in `server.js` only
- [ ] 🟡 Enable TypeScript gradually — start by typing the Redux store and API action creators (`tsconfig.json` already exists)
- [ ] 🟠 Set up ESLint + Prettier — replace broken `babel-eslint` config with `@typescript-eslint/parser`
- [ ] 🟡 Run `source-map-explorer` on production build — identify heavy dependencies and code-split or replace them
- [ ] 🟡 Remove duplicate mobile components — decide between `mobile/` and `mobile-new/` and delete the other
- [ ] 🟡 Remove large blocks of commented-out code throughout `src/`

---

## 6 · Backend Modernisation

- [ ] 🔴 Upgrade Node.js 8.x → 20 LTS — Node 8 is EOL since Dec 2019
- [ ] 🟠 Upgrade Express 4.16 → 5.x — async error handling, better router
- [ ] 🟠 Upgrade Mongoose 5 → 8 — multiple breaking changes in query API; significant perf improvements
- [ ] 🟠 Upgrade Socket.io 2.x → 4.x (must match `socket.io-client` in frontend)
- [ ] 🟠 Upgrade Redis client 2.x → 4.x — completely different async/Promise API
- [ ] 🟡 Upgrade Passport.js 0.4 → 0.7
- [ ] 🟡 Replace `moment` with `date-fns` in backend
- [ ] 🟠 Convert callback-style route handlers to `async/await` throughout
- [ ] 🟠 Add global Express error handler middleware — stop `try/catch` with `console.log` and no client response
- [ ] 🟠 Apply Joi schema validation middleware consistently to all routes (schemas already exist in `schemas/`)
- [ ] 🟠 Add structured logging with `winston` throughout — replace all `console.log` calls; add request-ID tracing
- [ ] 🟠 Add `GET /health` endpoint — returns DB, Redis, MinIO connection status
- [ ] 🟡 Add API versioning prefix (`/api/v1/`) to all routes

---

## 7 · DevOps & Infrastructure ⚙️

- [ ] 🔴 Fix root `docker-compose.yaml` — add backend, MongoDB, Redis, MinIO services; fix `fronend` typo
- [ ] 🟠 Create `docker-compose.dev.yml` — hot-reload for both frontend and backend with volume mounts
- [ ] 🟠 Create `docker-compose.prod.yml` — resource limits, restart policies, no source volume mounts
- [ ] 🟠 Publish Docker images to GitHub Container Registry (`ghcr.io/dominateai/dominate-ai`)
- [ ] 🟠 Write GitHub Actions CI pipeline:
  - [ ] Lint + type-check on every PR
  - [ ] Frontend tests on every PR
  - [ ] Backend tests on every PR
  - [ ] Docker build validation on every PR
  - [ ] `npm audit` security scan on every PR
  - [ ] CodeQL static analysis
  - [ ] Release workflow — build + push image + create GitHub Release on `v*` tag
  - [ ] Stale issue bot — label after 60 days, close after 14 more
- [ ] 🟡 Enable Dependabot for `frontend/` and `backend/`
- [ ] 🟡 Add `render.yaml` or `railway.json` for one-click deploy button
- [ ] 🟡 Replace GitLab CI file with GitHub Actions equivalents or remove it

---

## 8 · Testing

- [ ] 🟠 Set up Jest + React Testing Library for frontend
- [ ] 🟠 Write tests for critical paths: login, signup, dashboard render
- [ ] 🟠 Set up `supertest` + Jest for backend integration tests
- [ ] 🟠 Write backend tests for all public routes (`/public/login`, `/public/signup`, etc.)
- [ ] 🟡 Add Playwright or Cypress E2E tests — cover: sign up → log in → create lead → add task → log out
- [ ] 🟠 Add test step to CI pipeline — PR cannot merge if tests fail

---

## 9 · Open Source — Repository Health 🌍

- [ ] 🔴 Create `CONTRIBUTING.md` — local dev setup, PR process, commit conventions, what "good first issue" means
- [ ] 🔴 Create `CODE_OF_CONDUCT.md` — adopt Contributor Covenant (v2.1)
- [ ] 🔴 Create `SECURITY.md` — responsible disclosure policy; private email for vulnerabilities
- [ ] 🟠 Create `CHANGELOG.md` — start from v0.1.0 using Keep a Changelog format
- [ ] 🟠 Create `ARCHITECTURE.md` — component diagram, auth flow, data model overview (use Mermaid)
- [ ] 🟠 Create `ROADMAP.md` — public plan with milestones; link to GitHub Milestones
- [ ] 🔴 Create `.env.example` for both `frontend/` and `backend/` (also needed for Security section above)

---

## 10 · Open Source — GitHub Settings & Labels 🌍

- [ ] 🟠 Set up structured label system — Type, Priority, Difficulty, Status, Area (see OSS plan for full list)
- [ ] 🟠 Enable GitHub Discussions — Announcements, Q&A, Ideas, Show and Tell, General
- [ ] 🔴 Enable branch protection on `main` — require 1 review, CI must pass, no direct pushes
- [ ] 🟠 Add repository description, topics (`crm`, `open-source`, `self-hosted`, `sales`, `react`, `nodejs`, `mongodb`)
- [ ] 🟡 Pin 3–6 "help wanted" issues to the Issues tab to guide new contributors

---

## 11 · Open Source — Issue & PR Templates 🌍

- [ ] 🟠 Create `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] 🟠 Create `.github/ISSUE_TEMPLATE/feature_request.md`
- [ ] 🟠 Create `.github/ISSUE_TEMPLATE/security.md` — directs to `SECURITY.md` instead of public issue
- [ ] 🟠 Create `.github/PULL_REQUEST_TEMPLATE.md` — description, type of change, test checklist, screenshots

---

## 12 · Open Source — Release Management 🌍

- [ ] 🟠 Adopt Semantic Versioning — define `v1.0.0` milestone and what must be done to reach it
- [ ] 🟠 Adopt Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `security:`)
- [ ] 🟡 Set up `release-please` GitHub Action — auto-generates `CHANGELOG.md` and GitHub Release from commit messages
- [ ] 🟡 Create `v1.0.0` GitHub Milestone — list the issues that must close before launch

---

## 13 · Open Source — Documentation 📖

- [ ] 🔴 Write "Getting Started in 5 minutes" guide in Docusaurus — `docker-compose up` → done
- [ ] 🟠 Write Configuration reference — every `.env` variable with type, default, and description
- [ ] 🟠 Write self-hosting guide — VPS deployment, Nginx reverse proxy, SSL via Let's Encrypt, systemd service
- [ ] 🟠 Add Swagger/OpenAPI spec to backend — expose UI at `/api-docs`
- [ ] 🟡 Write Architecture overview page in Docusaurus with Mermaid diagrams
- [ ] 🟡 Write Contribution guide in Docusaurus (links to `CONTRIBUTING.md`, adds code examples)
- [ ] 🟡 Write per-feature user guides (Lead Management, Deal Pipelines, Tasks, etc.) with screenshots
- [ ] 🟡 Set up versioned docs — snapshot docs when `v1.0.0` is tagged

---

## 14 · Open Source — Community & Discoverability 🌍

- [ ] 🟠 Set up Discord server — channels: `#announcements`, `#general`, `#help-and-support`, `#contributing`, `#showcase`; link in README and docs
- [ ] 🟠 Add All Contributors bot — auto-generates contributor grid in README
- [ ] 🟡 Set up GitHub Sponsors or Open Collective — signals long-term commitment; allows companies to fund officially
- [ ] 🟡 Submit to `awesome-selfhosted` list
- [ ] 🟡 Submit to `awesome-crm` list
- [ ] 🟡 Plan Product Hunt launch (after `v1.0.0` + docs are solid)
- [ ] 🟡 Plan Hacker News "Show HN" post (same timing as Product Hunt)
- [ ] 🟡 Apply for OpenSSF Best Practices badge
- [ ] 🟡 Tag relevant issues with `hacktoberfest` label each October
- [ ] 🟡 Add `USERS.md` — community-maintained list of companies/projects using Dominate AI

---

## 15 · Open Source — License 🌍

- [ ] 🟠 Evaluate switching from GPL v3 → AGPL v3 — AGPL closes the SaaS loophole (running as a hosted service without contributing back); more appropriate for a self-hosted web app than GPL v3
- [ ] 🟡 Add license header comments to source files once license decision is finalised

---

## README Overhaul

- [ ] 🟠 Replace technology-stack badges with project-health badges (CI status, license, release version, Docker pulls, star count, Discord, OpenSSF)
- [ ] 🟠 Add one-command quickstart block at the top (`docker-compose up`)
- [ ] 🟠 Fix inaccurate badges — Next.js and Jenkins are not actually used; remove them
- [ ] 🟡 Add animated GIF or short video demo of the app in action
- [ ] 🟡 Add "Self-hosting in 60 seconds" section with a copy-pasteable shell snippet

---

## Suggested Execution Order

| Session | Focus Area |
|---|---|
| **Next** | Bug fixes (signup flow) + Mobile dark theme |
| **2** | Self-hosted migration (remove workspace complexity) |
| **3** | Security fixes (secrets → env vars, httpOnly cookies, rate limiting, helmet) |
| **4** | OSS repo health (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue templates, branch protection) |
| **5** | DevOps (fix Docker Compose, GitHub Actions CI) |
| **6** | Docs (Getting Started guide, `.env.example`, Swagger) |
| **7** | Backend modernisation (Node 20, Express 5, Mongoose 8, async/await) |
| **8** | Frontend modernisation (React 18, Router v6, Redux Toolkit) |
| **9** | Testing setup (Jest, supertest, Playwright) |
| **10** | Launch prep (v1.0.0 milestone, Product Hunt, Discord, awesome-selfhosted) |
