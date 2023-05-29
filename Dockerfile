FROM node:alpine

ARG CONNECTION
ENV CONNECTION $CONNECTION

ARG PASSWORD
ENV PASSWORD $PASSWORD

WORKDIR /app

COPY . /app

RUN npm install
RUN apk update && apk add bash


EXPOSE 8080

CMD ["npm", "start"]
