FROM node:18-slim

# Install Chrome dependencies for PDF generation
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome executable path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=4000

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json /app/
COPY server/package.json /app/server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Copy server files
COPY server /app/server/

# Create uploads directory with correct permissions
RUN mkdir -p /app/server/uploads && chmod 777 /app/server/uploads

# Expose port
EXPOSE 4000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:4000/api/status || exit 1

# Start the application
CMD ["node", "/app/server/index.js"]