FROM node:alpine

ARG CONNECTION_STRING
ENV CONNECTION_STRING $CONNECTION_STRING


WORKDIR /app

COPY . /app

RUN npm install -g npm@latest
RUN npm install


EXPOSE 3000

CMD ["npm", "start"]
