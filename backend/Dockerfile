# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Install build dependencies needed for native modules
RUN apk add --no-cache libc6-compat openssl

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# ─── Stage 2: Production Runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# Install only openssl for Prisma
RUN apk add --no-cache openssl

# Copy app source and dependencies
COPY --from=deps --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=hono:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=hono:nodejs prisma ./prisma
COPY --chown=hono:nodejs src ./src
COPY --chown=hono:nodejs package.json ./package.json
COPY --chown=hono:nodejs tsconfig.json ./tsconfig.json

# Create uploads directory
RUN mkdir -p uploads && chown hono:nodejs uploads

USER hono

EXPOSE 3001

# Run DB migrations then start server directly with tsx (no build step)
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
