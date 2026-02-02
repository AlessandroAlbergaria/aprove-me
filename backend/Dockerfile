FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY . .

ENV DATABASE_URL="file:./prisma/dev.db"

RUN npx prisma generate
RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json yarn.lock ./

EXPOSE 3000

CMD ["yarn", "start:prod"]
