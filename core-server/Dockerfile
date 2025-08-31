FROM node:20.11.1-alpine3.19


# Chrome + all deps + Node are preinstalled here
FROM ghcr.io/puppeteer/puppeteer:22

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache for dependencies
COPY package.json ./

# Copy the prisma directory
COPY prisma ./prisma

# Install dependencies within the container
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8000

# Build the TypeScript project
RUN yarn build

# Run the server
CMD ["node", "dist/server.js"]