.PHONY: all build up down restart logs logs-f clean re qr re-backend re-frontend re-db install-backend install-frontend attach update-ip show-users

all:	up

build:
	docker compose build

up: update-ip
	docker compose up -d --build
	docker compose logs frontend

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
	@echo "✅ PostgreSQL database rebuilt successfully!"
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

