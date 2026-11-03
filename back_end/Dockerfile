FROM node:18-bullseye-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 build-essential pkg-config libssl-dev \
  && rm -rf /var/lib/apt/lists/*
RUN npm ci --legacy-peer-deps
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
