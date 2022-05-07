FROM node:16.15.0-slim

RUN mkdir -p /app
WORKDIR /app
COPY ./index.js /app/index.js
COPY ./package-lock.json /app/package-lock.json
COPY ./package.json /app/package.json
RUN npm install -g
ENTRYPOINT [ "npm", "run", "start" ]
