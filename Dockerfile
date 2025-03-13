FROM node:18-slim

# Install Chrome dependencies for puppeteer
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
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json files first for better caching
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Create directories with correct permissions
RUN mkdir -p /app/server/uploads && chmod 777 /app/server/uploads
RUN chmod 777 /app/server && chmod 777 /app/client

# Install root dependencies
RUN npm install --production --no-bin-links

# Install server dependencies
WORKDIR /app/server
RUN npm install --production --no-bin-links

# Install and build client
WORKDIR /app/client
RUN npm install --no-bin-links
RUN npm run build

# Copy the rest of the app
WORKDIR /app
COPY . .

# Ensure uploads directory exists and has correct permissions
RUN chmod -R 777 /app/server/uploads

# Set environment variables
ENV NODE_ENV=production

# Expose the port
EXPOSE 4000

# Change to server directory and start the server
WORKDIR /app/server
CMD ["node", "index.js"]