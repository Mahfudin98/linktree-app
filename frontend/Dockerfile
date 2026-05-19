# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN NODE_ENV=development npm ci --legacy-peer-deps

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build SvelteKit with adapter-node
RUN npm run build

# ─── Stage 3: Production Runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Add non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 svelte

# Copy built app
COPY --from=builder --chown=svelte:nodejs /app/build ./build
COPY --from=builder --chown=svelte:nodejs /app/package.json ./package.json

# Install only production deps for the Node server
RUN npm install --omit=dev --ignore-scripts --legacy-peer-deps

USER svelte

EXPOSE 3000

CMD ["node", "build"]
