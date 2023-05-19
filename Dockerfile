FROM node:alpine

ARG CONNECTION_STRING
ENV CONNECTION_STRING $CONNECTION_STRING

WORKDIR /app

COPY . /app

RUN npm install
RUN apk update && apk add bash


EXPOSE 8080

CMD ["npm", "start"]
