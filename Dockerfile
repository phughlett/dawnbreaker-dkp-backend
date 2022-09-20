FROM node:alpine

ARG CONNECTION_STRING
ENV CONNECTION_STRING $CONNECTION_STRING


WORKDIR /app

COPY . /app

RUN npm config set cache /tmp --global &&\
    npm install knex -g &&\
    npm install

EXPOSE 3000

CMD ["npm", "start"]