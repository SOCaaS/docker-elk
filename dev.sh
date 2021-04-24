echo $'\342\232\231' "Initial Setup" $'\342\232\231'
echo $'\360\237\223\213' "Update Repository"
apt update

echo $'\360\237\220\263' "Install Docker.io & Docker-Compose"
apt install -y docker.io docker-compose

echo $'\342\232\231' "Install Tools"
apt install -y inotify-tools
docker-compose -f docker-compose.local.yml up --build -d kibana; 

trap ctrl_c INT

function ctrl_c() {
    docker-compose -f docker-compose.local.yml down -v
    docker image prune -f;
}

function check_log() {
    ( docker-compose -f docker-compose.local.yml logs -f kibana & ) | grep -q "http server running at http://0.0.0.0:5601"
    echo $'\360\237\221\223' " Server is ready to be tested!"
}

echo $'\342\217\261' " Wait for kibana to turn on!"
check_log
echo $'\342\254\207' "Creating 5 Agent Service!" $'\342\254\207'
for a in {1..5}
do
    curl --location --request POST 'http://localhost:5601/api/agent_controller/create' \
    --header 'kbn-xsrf: reporting' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "interfaces" : ["eth0","eht1","eth2"],
        "name" : "Agent Service '$a'",
        "ip" : "127.0.0.1"
    }'
    printf "\n"
done

# clear

echo $'\342\232\231' "Build on update"

#!/bin/bash
i=$((i+1))

while inotifywait -qqre modify "$(pwd)"; 
do 
    echo $'\342\232\231' "Start Building - Number:$i" $'\342\232\231';
    docker-compose -f docker-compose.local.yml up --build -d kibana; 
    echo $'\xF0\x9F\x9A\x80' "Build finished - Number:$i";
    echo $'\xF0\x9F\x8C\x80' "Git Branch"
    git branch;
    i=$((i+1))
    check_log &
done