# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
