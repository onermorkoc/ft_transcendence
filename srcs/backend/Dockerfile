FROM node:current-alpine3.17

RUN mkdir /tmp/ft_transcendence_backend
WORKDIR /tmp/ft_transcendence_backend
COPY ./srcs/ .
RUN npm install

CMD [ "npm", "start" ]