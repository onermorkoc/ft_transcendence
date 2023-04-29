YML_FILE	= ./srcs/docker-compose.yml
ENV_FILE	= ./srcs/.env
CLEAN_FILE	= ./srcs/tools/clean-docker.sh

all:
	sudo docker-compose -f $(YML_FILE) --env-file $(ENV_FILE) up --build

clean:
	sudo ./$(CLEAN_FILE)

re: clean all

.PHONY: all clean re 