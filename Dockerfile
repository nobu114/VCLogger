FROM ubuntu:22.04

RUN mkdir -p /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y nodejs npm
RUN npm install n -g
RUN n 16.15.0
COPY ./index.js /app/index.js
COPY ./package-lock.json /app/package-lock.json
COPY ./package.json /app/package.json
RUN npm install

