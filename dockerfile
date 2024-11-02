# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Generate Prisma Client during build
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Create start.sh script
RUN echo '#!/bin/sh\n\
npm install --legacy-peer-deps\n\
npx prisma generate\n\
npx prisma migrate deploy\n\
npm run dev' > start.sh && chmod +x start.sh

# Expose ports
EXPOSE 3000
EXPOSE 5555

# Command to run the application
CMD ["./start.sh"]