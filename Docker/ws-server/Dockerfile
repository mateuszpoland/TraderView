FROM node:16-alpine

WORKDIR /usr/src/app

COPY ../ws-server/package*.json .

RUN npm install

COPY ../ws-server .

EXPOSE 8081

ENTRYPOINT ["nodemon", "server.js"]
