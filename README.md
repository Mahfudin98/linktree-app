# 🌿 Linktree Clone — Full-Stack Application

A production-ready, self-hostable Linktree alternative built with a **decoupled architecture**.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Hono.js (Node.js) |
| **ORM** | Prisma |
| **Database** | PostgreSQL 16 |
| **Frontend** | SvelteKit (SSR/CSR hybrid) |
| **Deployment** | Docker + Docker Compose |

---

## 📁 Project Structure

```
linktree-app/
├── backend/                    # Hono.js API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Demo data seeder
│   ├── src/
│   │   ├── lib/
│   │   │   ├── db.ts           # Prisma singleton
│   │   │   ├── jwt.ts          # JWT utilities + middleware
│   │   │   ├── schemas.ts      # Zod validation schemas
│   │   │   └── response.ts     # Standard API response helpers
│   │   ├── routes/
│   │   │   ├── auth.ts         # POST /register, /login, GET /me
│   │   │   └── profile.ts      # GET /:username (public), PUT / (protected)
│   │   └── index.ts            # Server entry point
│   ├── Dockerfile              # Multi-stage production build
│   └── package.json
│
├── frontend/                   # SvelteKit Application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts          # Typed API client
│   │   │   ├── types.ts        # Shared TypeScript types
│   │   │   └── templates/      # ★ Modular Template System
│   │   │       ├── index.ts    # Template registry (add new templates here)
│   │   │       ├── minimalist/ # Clean monochromatic theme
│   │   │       ├── glassmorphism/ # Frosted glass + gradients
│   │   │       └── cyberpunk/  # Neon + terminal aesthetic
│   │   ├── routes/
│   │   │   ├── +layout.svelte  # Root layout
│   │   │   ├── +page.svelte    # Landing page
│   │   │   ├── [username]/     # ★ Dynamic public profile page
│   │   │   │   ├── +page.ts    # Load function (fetches from API)
│   │   │   │   └── +page.svelte # Renders selected template
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── dashboard/      # Protected link editor
│   │   ├── app.html
│   │   └── app.css
│   ├── Dockerfile              # Multi-stage production build
│   └── package.json
│
├── docker-compose.yaml          # Orchestration for all 3 services
├── .env.example                # Environment variables template
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development)

### 1. Clone & Configure

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values (especially passwords!)
```

### 2. Run with Docker (Production)

```bash
docker compose up -d --build
```

Services will start in order:
1. **PostgreSQL** → waits for health check ✓
2. **Backend** → runs migrations, then starts ✓
3. **Frontend** → starts after backend is healthy ✓

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |

### 3. Seed Demo Data (optional)

```bash
docker compose exec backend npm run db:seed
```

This creates 3 demo accounts:
| Username | Template | Email |
|----------|----------|-------|
| `demo` | Minimalist | demo@linktree.app |
| `glassuser` | Glassmorphism | glass@linktree.app |
| `cyberpunk` | Cyberpunk | cyber@linktree.app |

Password for all: `password123`

---

## 💻 Local Development

### Backend
```bash
cd backend
cp .env.example .env   # Set DATABASE_URL to your local Postgres
npm install
npm run db:migrate:dev
npm run dev            # Starts on :3001
```

### Frontend
```bash
cd frontend
cp .env.example .env   # Set PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev            # Starts on :5173
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile/:username` | ❌ | Public profile data |
| GET | `/api/profile` | ✅ | Own profile (with inactive links) |
| PUT | `/api/profile` | ✅ | Update profile, links, template |

### Example: Update Profile

```json
PUT /api/profile
Authorization: Bearer <token>

{
  "displayName": "John Doe",
  "bio": "Developer & creator",
  "templateSlug": "glassmorphism",
  "links": [
    { "title": "My Blog", "url": "https://blog.com", "icon": "globe" },
    { "title": "GitHub", "url": "https://github.com/johndoe", "icon": "github" }
  ],
  "socials": [
    { "platform": "twitter", "url": "https://twitter.com/johndoe" }
  ]
}
```

---

## 🎨 Adding a New Template

1. **Create the folder:**
   ```
   frontend/src/lib/templates/retro/Template.svelte
   ```

2. **Template component must accept this exact prop:**
   ```svelte
   <script lang="ts">
     import type { ProfileData } from '$lib/types';
     export let data: ProfileData;
   </script>
   ```

3. **Register in the registry:**
   ```typescript
   // frontend/src/lib/templates/index.ts
   export const TEMPLATE_IMPORTS = {
     minimalist: () => import('./minimalist/Template.svelte'),
     glassmorphism: () => import('./glassmorphism/Template.svelte'),
     cyberpunk: () => import('./cyberpunk/Template.svelte'),
     retro: () => import('./retro/Template.svelte'),  // ← Add this
   };
   ```

4. **Add metadata:**
   ```typescript
   export const TEMPLATE_META = [
     // ...existing templates
     { slug: 'retro', name: 'Retro', description: 'Vintage vibes.' },
   ];
   ```

5. **Allow the slug in backend schema validation** (`backend/src/lib/schemas.ts`):
   ```typescript
   templateSlug: z.enum(["minimalist", "glassmorphism", "cyberpunk", "retro"])
   ```

That's it! The `[username]` page will automatically dynamically import and render it. ✨

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ JWT tokens with configurable expiry
- ✅ Zod validation on all inputs
- ✅ Secure headers via Hono's `secureHeaders` middleware
- ✅ CORS configured with allowlist
- ✅ Non-root Docker users for both services
- ✅ Cascade deletes on profile → links
- ✅ Private profile support (`isPublic` field)
- ⚠️ Change `JWT_SECRET` and `POSTGRES_PASSWORD` in production!

---

## 🐳 Production Deployment Notes

For production, consider:
- Add an **Nginx reverse proxy** as a gateway
- Use **SSL/TLS** termination (Let's Encrypt via Certbot/Traefik)
- Set `PUBLIC_API_URL` to your backend's public domain
- Use a managed PostgreSQL service for better reliability
