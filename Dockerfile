FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src/server ./src/server
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY ecosystem.config.cjs ./

ENV NODE_ENV=production
ENV PORT=3001
ENV OLLAMA_HOST=http://host.docker.internal:11434

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node_modules/.bin/tsx", "server/index.ts"]
