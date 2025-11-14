FROM oven/bun:1 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    make \
    g++ \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production


FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Always rebuild Stockfish to ensure compatibility with the target architecture
RUN echo "Cloning and building Stockfish..." && \
    git clone --depth=1 https://github.com/official-stockfish/Stockfish.git src/bin/stockfish && \
    cd src/bin/stockfish/src && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then \
        echo "Building for ARM64..."; \
        make build ARCH=armv8; \
    else \
        echo "Building for x86-64..."; \
        make build ARCH=x86-64-sse41-popcnt; \
    fi && \
    chmod +x stockfish && \
    echo "Stockfish build finished!"

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .

# Ensure Stockfish binary has execute permissions
RUN chmod -R 755 src/bin/stockfish/src/stockfish || true

EXPOSE 3000

USER bun

CMD ["bun", "dev"]