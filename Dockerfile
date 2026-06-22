# ---- Frontend build ----
FROM oven/bun:1-alpine AS frontend
WORKDIR /app/frontend
# Vite inlines VITE_* vars at build time, so they must arrive as build args.
ARG VITE_UMAMI_URL
ARG VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_URL=${VITE_UMAMI_URL}
ENV VITE_UMAMI_WEBSITE_ID=${VITE_UMAMI_WEBSITE_ID}
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bunx vite build

# ---- Backend build ----
FROM golang:1.26-alpine AS backend
WORKDIR /app/server
ENV CGO_ENABLED=0
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
RUN go build -o /app/persona .

# ---- Final image ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates && \
    adduser -D -H -u 10001 persona
WORKDIR /app
COPY --from=backend /app/persona ./persona
COPY --from=frontend /app/frontend/dist ./dist
USER persona

ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- "http://localhost:${PORT}/api/races" || exit 1

ENTRYPOINT ["./persona"]
