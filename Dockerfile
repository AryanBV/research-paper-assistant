FROM node:18-slim as build

# Install dependencies for client build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

# Build client
COPY client/ ./
RUN npm run build

# Final image
FROM node:18-slim

# Install Chrome dependencies for PDF generation
RUN apt-get update && apt-get install -y \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 \
    libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 \
    libgtk-3-0 chromium curl --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=4000

# Set working directory
WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --production

# Copy server code
COPY server/ ./

# Copy built client from build stage
COPY --from=build /app/client/build /app/client/build

# Create uploads directory
RUN mkdir -p /app/server/uploads && chmod 777 /app/server/uploads

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/status || exit 1

# Start application
CMD ["node", "index.js"]