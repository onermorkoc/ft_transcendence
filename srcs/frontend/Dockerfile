FROM debian:stable

# Yerel paketleri güncelle.
RUN apt update && apt upgrade -y

# npm ve typescript yükle.
RUN apt install npm -y
RUN npm install typescript -g

# node son versiyona güncelle.
RUN npm install -g n
RUN apt install curl -y
RUN n latest

# Tmpde klasör oluştur ve src dosyalarını kopyala.
RUN mkdir /tmp/ft_transcendence_fronted
WORKDIR /tmp/ft_transcendence_fronted
COPY ./srcs/ .

# Up.
CMD [ "npm", "start" ]