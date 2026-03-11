# ============================================
# Stage 1: Install production dependencies only
# ============================================
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# Copy prisma schema if it exists (needed for prisma generate)
COPY src/prisma/ ./src/prisma/

RUN npm ci --omit=dev

# Generate Prisma client against prod node_modules (skip if no schema)
RUN npx prisma generate --schema=./src/prisma/schema.prisma 2>/dev/null || true


# ============================================
# Stage 2: Build TypeScript
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/

# Install ALL dependencies (including devDependencies for tsc)
RUN npm ci

# Generate Prisma client (skip if no schema)
RUN npx prisma generate --schema=./src/prisma/schema.prisma 2>/dev/null || true

# Compile TypeScript → dist/
RUN npx tsc


# ============================================
# Stage 3: Production image
# ============================================
FROM node:22-alpine AS production

# Install tini for proper PID 1 signal handling
RUN apk add --no-cache tini

# Set environment
ENV NODE_ENV=production

WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs && chown -R node:node /app/logs

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy compiled JavaScript from build stage
COPY --from=build /app/dist ./dist

# Copy package.json (needed by Node.js for module resolution)
COPY package.json ./

# Copy prisma schema & generated client (if they exist)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true
COPY --from=deps /app/src/prisma ./src/prisma 2>/dev/null || true

# Switch to non-root user
USER node

# Expose ports
#   5000 - TCP server (device telemetry)
#   3000 - HTTP/WebSocket server (future)
EXPOSE 5000 3000

# Health check: verify TCP server is accepting connections on port 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "const net=require('net');const s=net.createConnection(5000,'localhost');s.on('connect',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1))" || exit 1

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Start the server
CMD ["node", "./dist/index.js"]
