# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Create app.js if it doesn't exist
RUN touch app.js

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "app.js"]
