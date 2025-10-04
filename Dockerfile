FROM node:20-alpine

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm ci

COPY ./backend ./

EXPOSE 5000

# Для dev: в package.json у тебе start -> tsc-watch ... watch:server -> tsx watch
CMD ["npm", "start"]


