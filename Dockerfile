# ============================================
# Stage 1: Build Frontend (Vite)
# ============================================
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ============================================
# Stage 2: Install Server Deps + Prisma
# ============================================
FROM node:22-alpine AS server-build

WORKDIR /app/server

COPY server/package.json server/package-lock.json server/tsconfig.json ./
COPY server/prisma/ ./prisma/

# Install all deps (including tsx/typescript) and generate Prisma client
RUN npm ci --ignore-scripts && \
    npx prisma generate --schema=./prisma/schema.prisma

# Copy source code (needed for tsx to run)
COPY server/src/ ./src/

# Prune dev dependencies, but keep tsx/typescript (now in dependencies)
RUN npm prune --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/*


# ============================================
# Stage 3: Production Image
# ============================================
FROM node:22-alpine AS production

RUN apk add --no-cache tini \
    && addgroup -g 1001 appgroup \
    && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

ENV NODE_ENV=production
WORKDIR /app

# Copy server
COPY --from=server-build --chown=appuser:appgroup /app/server/node_modules ./server/node_modules
COPY --from=server-build --chown=appuser:appgroup /app/server/src ./server/src
COPY --from=server-build --chown=appuser:appgroup /app/server/package.json ./server/
COPY --from=server-build --chown=appuser:appgroup /app/server/tsconfig.json ./server/

# Copy built frontend into server's serving path
COPY --from=frontend-build --chown=appuser:appgroup /app/frontend/dist ./frontend/dist

RUN mkdir -p /app/server/logs && chown appuser:appgroup /app/server/logs

USER appuser

# Render uses PORT env var (usually 10000)
EXPOSE ${PORT:-5001}

ENTRYPOINT ["/sbin/tini", "--"]
# Run server from source via tsx — it serves both API and frontend static
CMD ["npx", "--prefix", "server", "tsx", "src/index.ts"]
