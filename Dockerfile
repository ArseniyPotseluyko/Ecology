# Stage 1: сборка React
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY public/ ./public/
COPY src/ ./src/

# REACT_APP_API_URL пустой — все /api/ запросы относительные (через nginx proxy)
RUN REACT_APP_API_URL="" npm run build

# Stage 2: nginx для раздачи статики и проксирования
FROM nginx:alpine

# Копируем собранный React
COPY --from=build /app/build /usr/share/nginx/html

# Копируем nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
