# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package.json and lockfile
COPY ../../package.json ../../package-lock.json ./
# Copy workspace package.json
COPY ./package.json ./apps/api/package.json

# Install dependencies for the workspace
RUN npm install --workspaces --include-workspace-root --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app/apps/api
COPY --from=deps /app/node_modules ../../node_modules
COPY . .

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app/apps/api

ENV NODE_ENV production

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ../../node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/index.js"] 