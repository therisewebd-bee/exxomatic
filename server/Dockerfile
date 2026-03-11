# ============================================
# Stage 1: Build TypeScript & install deps
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/

# Install all deps, generate Prisma client, compile TS, then prune to prod-only
RUN npm ci --ignore-scripts \
    && npx prisma generate --schema=./src/prisma/schema.prisma 2>/dev/null || true \
    && npx tsc --sourceMap false \
    && npm prune --omit=dev \
    && npm cache clean --force \
    && rm -rf /root/.npm /tmp/*


# ============================================
# Stage 2: Minimal production image
# ============================================
FROM node:22-alpine AS production

RUN apk add --no-cache tini \
    && addgroup -g 1001 appgroup \
    && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

ENV NODE_ENV=production
WORKDIR /app

# Copy only what's needed to run
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/package.json ./

RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

USER appuser

EXPOSE 5000 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "const s=require('net').createConnection(5000,'localhost');s.on('connect',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/index.js"]
