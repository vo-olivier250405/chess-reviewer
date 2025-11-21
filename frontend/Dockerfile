# Frontend Dockerfile
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy all project files
COPY . .

# Expose Vite dev server
EXPOSE 5173

# Run dev server
CMD ["bun", "dev", "--host"]
