# Этап 1: сборка
FROM node:25-alpine AS builder

# Установка pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Этап 2: продакшн
FROM node:25-alpine

ENV NODE_ENV=production

# Установка pnpm в финальном образе (если планируется использовать pnpm start)
RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
