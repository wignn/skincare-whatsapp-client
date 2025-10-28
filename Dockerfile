FROM node:20-alpine AS builder

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install && \
    npm cache clean --force

COPY . .

# Set dummy DATABASE_URL for Prisma generate (not used, just required)
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tini

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm install --production && \
    npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

USER nodejs

EXPOSE 5555

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5555/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/index.js"]
