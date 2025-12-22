# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Expo default ports
EXPOSE 8081 19000 19001 19002

# Start Expo development server
CMD ["npm", "start"]
