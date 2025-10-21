# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat \
    && addgroup -S nodejs \
    && adduser -S nextjs -G nodejs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
