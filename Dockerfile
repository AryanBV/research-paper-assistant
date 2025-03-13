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

# Copy package.json files first
COPY package*.json ./

# Install root dependencies
RUN npm install --production

# Copy the application files
COPY . .

# Create uploads directory
RUN mkdir -p /app/server/uploads

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the server directly from server directory
# Important: Using direct node command instead of npm start
CMD ["node", "index.js"]