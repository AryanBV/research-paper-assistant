FROM ghcr.io/puppeteer/puppeteer:20.9.0

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Create and set permissions for uploads directory
RUN mkdir -p /app/server/uploads && \
    chmod 777 /app/server/uploads

# Install dependencies using production flag to skip dev dependencies
RUN npm install --production && \
    cd server && npm install --production && \
    cd ../client && npm install && npm run build

# Change working directory to server directory
WORKDIR /app/server

# Expose port 4000
EXPOSE 4000

# Run server with explicit environment variables
ENV NODE_ENV=production \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Run server
CMD ["node", "index.js"]