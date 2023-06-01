FROM node:current-alpine3.17

RUN mkdir /tmp/ft_transcendence_backend
WORKDIR /tmp/ft_transcendence_backend
COPY ./srcs/ .
RUN npm install
RUN apk update && apk add bash

CMD [ "npm", "run", "start:dev"]