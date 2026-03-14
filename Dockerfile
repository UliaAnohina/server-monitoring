FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine

ENV VITE_USE_MOCKS=true \
    VITE_API_BASE_URL=http://localhost:8000 \
    VITE_MOCK_DELAY=500 \
    VITE_AUTO_REFRESH_PROCESSES=10000 \
    VITE_AUTO_REFRESH_METRICS=3000 \
    VITE_AUTO_REFRESH_ENABLED=true \
    NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates \
    NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template \
    NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY runtime-config.js.template /etc/nginx/templates/runtime-config.js.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
