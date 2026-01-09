.PHONY: all build up down restart logs logs-f clean re re-backend re-frontend re-db install-backend install-frontend attach update-ip show-users mobile get-tunnel-url update-tunnel-url start

# Default command - Smart startup
all:	start

# Traditional up command (for scripts/automation)
up: update-ip
	@docker compose up -d --build postgres backend
	@echo "Waiting for main services to start..."
	@sleep 8
	@docker compose up -d tunnel
	@echo "Waiting for tunnel to establish connection..."
	@sleep 12
	@echo "Detecting tunnel URL..."
	@$(MAKE) update-tunnel-url || true
	@docker compose up -d frontend
	@sleep 5
	@echo ""
	@echo "Services started successfully"
	@echo "View QR code: make logs"
	@docker compose logs frontend --tail 20

build:
	docker compose build

update-ip:
	@echo "Detected IP: $$(ip route get 1 | awk '{print $$7;exit}')"
	@if [ "$$(uname)" = "Darwin" ]; then \
		sed -i '' "s|EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=http://$$(ip route get 1 | awk '{print $$7;exit}'):9000|g" .env; \
		sed -i '' "s|REACT_NATIVE_PACKAGER_HOSTNAME=.*|REACT_NATIVE_PACKAGER_HOSTNAME=$$(ip route get 1 | awk '{print $$7;exit}')|g" .env; \
	else \
		sed -i "s|EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=http://$$(ip route get 1 | awk '{print $$7;exit}'):9000|g" .env; \
		sed -i "s|REACT_NATIVE_PACKAGER_HOSTNAME=.*|REACT_NATIVE_PACKAGER_HOSTNAME=$$(ip route get 1 | awk '{print $$7;exit}')|g" .env; \
	fi

ios:
	@cd frontend && EXPO_PUBLIC_BACKEND_URL=localhost npx expo start

down:
	docker compose down

logs:
	docker compose logs frontend

attach:
	docker attach frontend

clean:
	docker compose down -v --remove-orphans

fclean:
	docker compose down --rmi all --volumes --remove-orphans

re-backend:
	docker compose stop backend
	docker compose up -d --build backend

re-frontend:
	docker compose stop frontend
	docker compose up -d --build frontend

re-db:
	docker compose stop postgres
	docker compose rm -f postgres
	docker volume rm swifty-proteins_postgres_data || true
	docker compose up -d --build postgres
	@sleep 5
	@echo "PostgreSQL database rebuilt successfully"
	docker compose restart backend

restart:
	docker compose down
	docker compose up -d --build

re:	fclean up

install-backend:
	docker compose exec backend npm install

install-frontend:
	docker compose exec frontend npm install

copy-node_modules:
	docker compose exec -T backend tar cf - node_modules | tar xf - -C ./backend

show-users:
	docker compose exec postgres psql -U postgres -d swifty_proteins -c "SELECT * FROM users;"

# ============================================
# Mobile Setup Commands
# ============================================

get-tunnel-url:
	@./get-tunnel-url.sh

update-tunnel-url:
	@echo "Obtaining public tunnel URL..."
	@TUNNEL_URL=$$(./get-tunnel-url.sh | tail -1); \
	if [ -z "$$TUNNEL_URL" ]; then \
		echo "ERROR: Could not obtain tunnel URL"; \
		echo "Is the tunnel container running?"; \
		echo "Execute: docker compose logs tunnel"; \
		exit 1; \
	fi; \
	echo "URL found: $$TUNNEL_URL"; \
	if [ "$$(uname)" = "Darwin" ]; then \
		sed -i '' "s|EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=$$TUNNEL_URL|g" .env; \
	else \
		sed -i "s|EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=$$TUNNEL_URL|g" .env; \
	fi; \
	echo ".env updated with tunnel URL"

mobile:
	@echo "Starting services with automatic tunnel..."
	@docker compose up -d --build postgres backend
	@echo "Waiting for main services to start..."
	@sleep 8
	@docker compose up -d tunnel
	@echo "Waiting for tunnel to establish connection..."
	@sleep 12
	@$(MAKE) update-tunnel-url
	@echo ""
	@echo "Starting frontend with new configuration..."
	@docker compose up -d --build frontend
	@sleep 8
	@echo ""
	@echo "All ready for mobile on different network"
	@echo ""
	@echo "Scan QR code with Expo Go:"
	@docker compose logs frontend --tail 40 | grep -A 30 "Metro waiting" || docker compose logs frontend --tail 20
	@echo ""
	@echo "View tunnel logs:"
	@echo "   docker logs tunnel -f"
	@echo ""
	@TUNNEL_URL=$$(cat .env | grep EXPO_PUBLIC_BACKEND_URL | cut -d= -f2); \
	echo "Public backend: $$TUNNEL_URL"
	@echo ""
	@echo "NOTE: If tunnel URL changes, execute: make update-tunnel-url && make re-frontend"

