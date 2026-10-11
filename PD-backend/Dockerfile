
# Build stage
FROM node:22-bookworm AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY src ./src

# Runtime stage
FROM gcr.io/distroless/nodejs22-debian12:nonroot

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/server.js ./server.js
COPY --from=build --chown=nonroot:nonroot /app/src ./src

EXPOSE 5000

CMD ["server.js"]
