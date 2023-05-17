#!/bin/bash

echo "=> Cleaning docker ..."

sudo docker rmi -f $(sudo docker images -q)
sudo docker rm $(sudo docker ps -a -q)
sudo docker volume rm $(sudo docker volume ls -q)
sudo docker network rm $(sudo docker network ls -q)

echo "=> Done ..."