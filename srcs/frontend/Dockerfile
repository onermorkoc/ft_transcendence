FROM node:current-alpine3.17

RUN mkdir /tmp/ft_transcendence_frontend
WORKDIR /tmp/ft_transcendence_frontend
COPY ./srcs/ .
RUN npm install

CMD [ "npm", "start" ]