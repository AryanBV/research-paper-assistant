FROM ghcr.io/puppeteer/puppeteer:20.9.0

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Create uploads directory without changing permissions
RUN mkdir -p /app/server/uploads

# Fix permissions for the pptruser (the default user in puppeteer image)
RUN chown -R pptruser:pptruser /app

# Switch to pptruser before running npm commands
USER pptruser

# Install dependencies
RUN npm install --production && \
    cd server && npm install --production && \
    cd ../client && npm install && npm run build

# Change working directory to server directory
WORKDIR /app/server

# Expose port 4000
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Run server
CMD ["node", "index.js"]