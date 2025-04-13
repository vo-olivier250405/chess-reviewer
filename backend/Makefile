STOCKFISH_REPO=https://github.com/official-stockfish/Stockfish.git
STOCKFISH_DIR=src/bin/stockfish

.PHONY: build run clean

build:
	@if [ ! -d "$(STOCKFISH_DIR)" ]; then \
		echo "Cloning Stockfish..."; \
		git clone --depth=1 $(STOCKFISH_REPO) $(STOCKFISH_DIR); \
		cd $(STOCKFISH_DIR)/src && make build ARCH=x86-64-modern
		@echo "✅ Stockfish build terminé."
		chmod +x $(STOCKFISH_BIN)
	fi

run:
	cd backend && bun run index.ts

clean:
	rm -rf $(STOCKFISH_DIR)
