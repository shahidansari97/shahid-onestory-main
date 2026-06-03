# OneStory Main Site - Project Architecture

This document describes how the repository is organized, where core features live, and how to navigate code for implementation work.

---

## 1) Technology Baseline

### Backend
- **Framework:** Laravel 11 (PHP 8.2+)
- **Pattern:** MVC + service layer via contracts and implementations
- **Auth:** Laravel session auth (Breeze stack) + OAuth providers
- **Authorization:** role middleware and permission checks
- **Data:** Eloquent ORM + migrations/seeders

### Frontend
- **Framework:** React 18
- **Bridge:** Inertia.js (`@inertiajs/react`)
- **Build:** Vite
- **Styling:** Tailwind CSS + custom CSS files
- **State model:** React hooks + context (no global Redux store)

---

## 2) Repository Structure

```text
onestory-main-site/
├─ app/
│  ├─ Contracts/Services/              # Service interfaces
│  ├─ Services/                        # Business logic implementations
│  ├─ Http/
│  │  ├─ Controllers/
│  │  │  ├─ Admin/                     # Admin features
│  │  │  ├─ Auth/                      # Auth + OAuth flows
│  │  │  └─ Webhooks/                  # Stripe/PayPal webhook handlers
│  │  └─ Middleware/                   # Auth/role/inertia/share middleware
│  ├─ Models/                          # Domain models (Story, User, Comment...)
│  └─ Providers/                       # DI bindings (contracts -> services)
│
├─ bootstrap/
│  └─ app.php                          # Laravel 11 middleware/route wiring
│
├─ config/                             # App/service/storage/payment config
├─ database/
│  ├─ migrations/
│  ├─ seeders/
│  └─ factories/
│
├─ resources/
│  ├─ js/
│  │  ├─ app.jsx                       # Inertia React bootstrap
│  │  ├─ bootstrap.js                  # axios + frontend boot helpers
│  │  ├─ Pages/                        # Route-level pages (Inertia)
│  │  ├─ Components/                   # Shared + feature components
│  │  ├─ Layouts/                      # Guest/Authenticated wrappers
│  │  ├─ Contexts/                     # Global sound, mute, editor redirect
│  │  ├─ Hooks/                        # Reusable hooks (likes/media/device)
│  │  └─ Utils/                        # Utilities (analytics, caches, media)
│  ├─ css/                             # base/home/module CSS
│  └─ views/app.blade.php              # Inertia root blade template
│
├─ routes/
│  ├─ web.php                          # Main route map (pages + actions)
│  ├─ auth.php                         # Authentication routes
│  ├─ api.php                          # API routes (minimal)
│  └─ channels.php                     # Broadcast channels
│
├─ public/                             # Built assets + public uploads
├─ storage/                            # Laravel storage
├─ package.json
├─ composer.json
└─ vite.config.js
```

---

## 3) Backend Architecture

### Request Handling Pattern
Most flows follow:
1. `routes/web.php` maps route -> controller action
2. controller validates/auth-checks request
3. controller delegates use-case to service class
4. service reads/writes via Eloquent models
5. response returns either Inertia page props or JSON payload

### Layer Responsibilities
- **Controllers:** HTTP orchestration and response shaping
- **Services:** business logic and domain workflows
- **Models:** relationships, scopes, casts, persistence
- **Middleware:** cross-cutting concerns (auth, roles, shared props)

### Key Domains (Backend)
- User/auth/profile
- Stories and interactions (likes/comments/shares/views)
- Follow and social graph
- Wallet/payments/gifts/donations
- Admin CMS and moderation
- Media and recorder workflows

---

## 4) Frontend Architecture

### Boot and Rendering
- Entry: `resources/js/app.jsx`
- Inertia resolves page modules in `resources/js/Pages`
- Layout wrappers provide shared shell and common UI

### Frontend Layers
- **Pages:** route-owned views and page composition
- **Components:** reusable UI and feature widgets
- **Hooks:** feature behavior (like state, media handling, desktop/mobile logic)
- **Contexts:** app-wide state where prop drilling is costly
- **Utils:** helper modules for caching, analytics, conversions

### Home/Story Feature Area
- Main orchestrator: `resources/js/Pages/Home/Index.jsx`
- Story UI: `resources/js/Components/Story/*`
- Modal stack: `resources/js/Components/Modals/*`
- Like/share/comment interactions are handled with axios calls to named Laravel routes and local optimistic updates where needed.

---

## 5) Route Architecture

### Public
- Homepage and story discovery/listing
- Static content and information pages

### Authenticated
- Profile management
- Story creation and interaction actions
- Recorder and user-specific content/actions
- Wallet/payment features

### Admin
- Prefixed admin routes
- Protected by auth + role checks
- Dashboard/content moderation/settings/financial tools

---

## 6) Data Model Areas

### Core Social
- `users`
- `stories`
- `story_likes`
- `comments`
- `story_views`
- `follows`

### Monetization
- wallet/balance entities
- gift and donation transactions
- payment records and webhook-linked state

### Content/Platform
- homepage/configuration entities
- static page and CMS-like tables
- moderation/status entities

---

## 7) Integrations

- **Payments:** Stripe and PayPal
- **Real-time:** Pusher/Laravel Echo patterns
- **Auth providers:** Google/Facebook OAuth
- **Media tooling:** client-side and server-side media workflows

---

## 8) Build and Runtime

### Local Development
```bash
composer install
npm install
php artisan migrate --seed
npm run dev
php artisan serve
```

### Production Basics
```bash
npm run build
php artisan optimize
```

---

## 9) How To Navigate for Changes

- **Header/footer/layout:** `resources/js/Layouts` and shared `resources/js/Components`
- **Home page behavior:** `resources/js/Pages/Home/Index.jsx`
- **Story card logic:** `resources/js/Components/Story`
- **Modal behavior:** `resources/js/Components/Modals`
- **Business rule changes:** `app/Services` (and matching contract)
- **Endpoint/controller changes:** `routes/web.php` + `app/Http/Controllers`
- **Schema changes:** `database/migrations`

---

## 10) Notes

- This is a Laravel monolith with a React frontend delivered through Inertia.
- The most active product surface is centered around Home + Story interactions.
- For infrastructure-level topology (containers, external dependencies, sequence diagrams), see `SYSTEM_ARCHITECTURE.md`.
