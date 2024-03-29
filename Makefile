YML_FILE	= ./srcs/docker-compose.yml
DEV_YML_FILE = ./srcs/docker-compose-dev.yml
ENV_FILE	= ./srcs/.env
CLEAN_FILE	= ./srcs/tools/clean-docker.sh
DOCKER_INSTALL_FILE = ./srcs/tools/install-docker.sh 

all:
	sudo docker-compose -f $(YML_FILE) up --build

dev:
	sudo docker-compose -f $(DEV_YML_FILE) up --build

clean_local:
	sudo rm -rf ./srcs/backend/srcs/node_modules
	sudo rm -rf ./srcs/backend/srcs/public/uploads
	sudo rm -rf ./srcs/backend/srcs/dist
	sudo rm -rf ./srcs/frontend/srcs/node_modules

run_back: prisma
	sudo npm install --prefix ./srcs/backend/srcs
	sudo npm start --prefix ./srcs/backend/srcs

run_front:
	sudo npm install --prefix ./srcs/frontend/srcs
	sudo npm start --prefix ./srcs/frontend/srcs

prisma:
	cd srcs/backend/srcs; sudo npx prisma db push

studio:
	cd srcs/backend/srcs; sudo npx prisma studio

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