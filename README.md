# Server Monitoring

Frontend-приложение на React + Vite для мониторинга серверных процессов.

## Локальный запуск

```bash
npm ci
npm run dev
```

## Docker

Сборка образа:

```bash
docker build -t server-monitoring .
```

Запуск контейнера со значениями по умолчанию:

```bash
docker run --rm -p 8080:80 server-monitoring
```

Приложение будет доступно на `http://localhost:8080`.

По умолчанию контейнер стартует в мок-режиме. Чтобы переключиться на реальный API, можно передать переменные окружения при запуске:

```bash
docker run --rm -p 8080:80 \
  -e VITE_USE_MOCKS=false \
  -e VITE_API_BASE_URL=http://localhost:8000 \
  server-monitoring
```

Поддерживаемые переменные:

- `VITE_USE_MOCKS` - `true` или `false`
- `VITE_API_BASE_URL` - базовый URL API
- `VITE_MOCK_DELAY` - задержка моков в миллисекундах
- `VITE_AUTO_REFRESH_PROCESSES` - интервал обновления процессов
- `VITE_AUTO_REFRESH_METRICS` - интервал обновления метрик
- `VITE_AUTO_REFRESH_ENABLED` - включает автообновление

Важно: `VITE_API_BASE_URL` должен быть доступен из браузера пользователя, потому что запросы к API выполняются на клиенте.

## Frontend + Backend + DB

Если backend лежит рядом в `../monitoringSystemBackend`, можно поднять всё одной командой из этой директории:

```bash
docker compose up --build
```

Что поднимется:

- frontend: `http://localhost:8080`
- backend: `http://localhost:8000`
- postgres: внутри compose-сети

Во frontend для compose автоматически включается:

- `VITE_USE_MOCKS=false`
- `VITE_API_BASE_URL=/api`

Это значит, что запросы из браузера идут в `http://localhost:8080/api/...`, а `nginx` проксирует их в backend-контейнер. Так не нужен CORS между `:8080` и `:8000`.

Важно: для backend нужен файл `../monitoringSystemBackend/.env`, потому что `docker-compose.yml` использует его и для приложения, и для базы.

Если `8080` уже занят, можно поднять frontend на другом порту без правки файла:

```bash
FRONTEND_PORT=8081 docker compose up --build -d
```

Тогда frontend будет доступен на `http://localhost:8081`.

Остановить всё:

```bash
docker compose down
```

Остановить и удалить volume Postgres:

```bash
docker compose down -v
```
