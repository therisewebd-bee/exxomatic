# ============================================
# Stage 1: Install deps & generate Prisma
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY prisma/ ./prisma/

# Install all deps (including tsx/typescript) and generate Prisma client
RUN npm ci --ignore-scripts && \
    npx prisma generate --schema=./prisma/schema.prisma

# Copy source code (needed for tsx to run)
COPY src/ ./src/

# Prune dev dependencies, but keep tsx/typescript (now in dependencies)
RUN npm prune --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/*


# ============================================
# Stage 2: Minimal production image
# ============================================
FROM node:22-alpine AS production

RUN apk add --no-cache tini \
    && addgroup -g 1001 appgroup \
    && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

ENV NODE_ENV=production
WORKDIR /app

# Copy everything needed to run from source via tsx
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/src ./src
COPY --from=build --chown=appuser:appgroup /app/package.json ./
COPY --from=build --chown=appuser:appgroup /app/tsconfig.json ./

RUN mkdir -p /app/logs && chown appuser:appgroup /app/logs

USER appuser

EXPOSE 5000 3001 5001

ENTRYPOINT ["/sbin/tini", "--"]
# Run directly from source using tsx
CMD ["npx", "tsx", "src/index.ts"]
