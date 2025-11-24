FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# nginx stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html