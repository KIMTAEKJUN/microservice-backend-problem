FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY libs ./libs

COPY . .
COPY .env .env

RUN npm install
RUN npm run build

RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]