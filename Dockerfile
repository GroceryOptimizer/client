# Build app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

# Serve compiled app
FROM node:18-alpine

RUN npm install -g http-server

WORKDIR /usr/src/app

COPY --from=builder /app/build .

EXPOSE 8080

CMD ["http-server", "-p", "8080"]
