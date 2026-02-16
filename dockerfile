# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --network-timeout=1000000
COPY . .

# Ambil variabel dari build-args agar masuk ke dalam file JS
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:stable-alpine
# Salin hasil build dari stage 1
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]