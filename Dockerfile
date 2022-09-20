FROM node:alpine

ARG CONNECTION_STRING
ENV CONNECTION_STRING $CONNECTION_STRING


WORKDIR /app

COPY . /app

RUN npm config set cache /tmp --global
RUN npm install knex --save-dev
RUN npm install
RUN sudo chown -R 1000:1000 "/tmp

EXPOSE 3000

CMD ["npm", "start"]
