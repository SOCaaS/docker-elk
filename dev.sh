echo -e "\nInstall Tools"
apt install -y inotify-tools

echo -e "\nBuild on update"

#!/bin/bash
i=$((i+1))

while inotifywait -qqre modify "$(pwd)"; 
do 
    echo -e "\nStart Building - Number:$i"
    docker-compose -f docker-compose.local.yml up --build -d kibana; 
    echo -e "\nBuild finished - Number:$i"
    i=$((i+1))
    sleep 10
done