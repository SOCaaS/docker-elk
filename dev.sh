echo ⚙ "Initial Setup" ⚙
echo 📚 "Update Repository"
apt update

echo 🐳 "Install Docker.io & Docker-Compose"
apt install -y docker.io docker-compose

echo ⚙ "Install Tools"
apt install -y inotify-tools
docker-compose -f docker-compose.local.yml up --build -d kibana; 

trap ctrl_c INT

function ctrl_c() {
    docker-compose -f docker-compose.local.yml down -v
    docker image prune -f;
    echo "🙏 Thank you for using dev.sh tool"
}

function check_log() {
    ( docker-compose -f docker-compose.local.yml logs -f kibana & ) | grep -q "http server running at http://0.0.0.0:5601"
    echo  "👍 Kibana is up and ready to be tested! 💻"
}

echo ⌚ "Wait for kibana to turn on!" ⌛
check_log
echo 👻 "Creating 5 Agent Service!" 👻
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

echo ⏩⏩⏩ "Build on update"

#!/bin/bash
i=$((i+1))

while inotifywait -qqre modify "$(pwd)"; 
do 
    echo 🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️🏃‍♂️ "Start Building - Number:$i" ⛏⚒🛠;
    docker-compose -f docker-compose.local.yml up --build -d kibana; 
    echo 🍻🍺🎉 "Build finished - Number:$i";
    echo ✔ "Git Branch"
    git branch;
    i=$((i+1))
    check_log &
done