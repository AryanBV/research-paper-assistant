FROM node:18

# Install latest Chrome dependencies
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies using regular npm install (more forgiving than npm ci)
RUN npm install && \
    cd server && npm install && \
    cd ../client && npm install && npm run build

# Expose port 4000
EXPOSE 4000

# Start server
CMD ["npm", "start"]