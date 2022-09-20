FROM node:alpine

ARG CONNECTION_STRING
ENV CONNECTION_STRING $CONNECTION_STRING
RUN npm install -g npm@latest


WORKDIR /app

COPY . /app


RUN npm install


EXPOSE 3000

CMD ["npm", "start"]
