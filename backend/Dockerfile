# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 1. Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# 2. Copy the actual application files directly into /app
COPY --from=builder /app ./

EXPOSE 5000

# 3. Dynamic entry point that uses npm scripts to locate the file automatically
CMD ["npm", "start"]
