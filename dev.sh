echo "Update"
apt update

echo "Install Docker.io & Docker-Compose"
apt install -y docker.io docker-compose

echo "Install Tools"
apt install -y inotify-tools
docker-compose -f docker-compose.local.yml up --build -d kibana; 

trap ctrl_c INT

function ctrl_c() {
    docker-compose -f docker-compose.local.yml down -v
    docker image prune -f;
}

clear

echo "Build on update"

#!/bin/bash
i=$((i+1))

while inotifywait -qqre modify "$(pwd)"; 
do 
    echo "Start Building - Number:$i"
    docker-compose -f docker-compose.local.yml up --build -d kibana; 
    echo "Build finished - Number:$i"
    i=$((i+1))
    # sleep 10
done