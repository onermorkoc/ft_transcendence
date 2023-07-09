YML_FILE	= ./srcs/docker-compose.yml
DEV_YML_FILE = ./srcs/docker-compose-dev.yml
ENV_FILE	= ./srcs/.env
CLEAN_FILE	= ./srcs/tools/clean-docker.sh
DOCKER_INSTALL_FILE = ./srcs/tools/install-docker.sh 

all:
	sudo docker-compose -f $(YML_FILE) --env-file $(ENV_FILE) up --build

dev:
	sudo docker-compose -f $(DEV_YML_FILE) --env-file $(ENV_FILE) up --build

clean_local:
	sudo rm -rf ./srcs/backend/node_modules
	sudo rm -rf ./srcs/backend/public/uploads
	sudo rm -rf ./srcs/backend/dist
	sudo rm -rf ./srcs/frontend/node_modules

run_back: prisma
	sudo npm install --prefix ./srcs/backend/
	sudo npm start --prefix ./srcs/backend/

run_front:
	sudo npm install --prefix ./srcs/frontend/
	sudo npm start --prefix ./srcs/frontend/

tail_back:
	docker logs -f ft_transcendence_backend

tail_front:
	docker logs -f ft_transcendence_frontend

tail_db:
	docker logs -f ft_transcendence_database

prisma:
	cd srcs/backend; sudo npx prisma db push

studio:
	cd srcs/backend; sudo npx prisma studio

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