YML_FILE	= ./srcs/docker-compose.yml
DEV_YML_FILE = ./srcs/docker-compose-dev.yml
ENV_FILE	= ./srcs/.env
CLEAN_FILE	= ./srcs/tools/clean-docker.sh
DOCKER_INSTALL_FILE = ./srcs/tools/install-docker.sh 

all:
	sudo docker-compose -f $(YML_FILE) --env-file $(ENV_FILE) up --build

dev:
	sudo docker-compose -f $(DEV_YML_FILE) --env-file $(ENV_FILE) up --build

prisma:
	cd srcs/backend/srcs; sudo npx prisma db push

down:
	sudo docker-compose -f $(YML_FILE) down

devdown:
	sudo docker-compose -f $(DEV_YML_FILE) down

clean:
	sudo ./$(CLEAN_FILE)

docker-install:
	sudo ./$(DOCKER_INSTALL_FILE)

re: clean all

.PHONY: all clean re 