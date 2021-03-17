echo "Install Tools"
apt install -y inotify-tools

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
    sleep 10
done