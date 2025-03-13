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

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p /app/server/uploads

# Install dependencies
RUN npm install --production
RUN cd server && npm install --production

# Create a startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'cd /app/server && node index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Use the shell script to start the application
CMD ["/app/start.sh"]