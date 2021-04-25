echo -e ⚙ "Initial Setup" ⚙
echo -e "\n📚 Updating Repository"
apt update

echo -e "\n🐳 Install Docker.io & Docker-Compose"
apt install -y docker.io docker-compose

echo -e "\n⚙ Install Tools"
apt install -y inotify-tools

echo -e "\n"🏃‍♂️🏃‍♀️🏃‍♂️" \033[32mStart Building\t-\tNumber:0\033[0m" ⛏⚒🛠;
docker-compose -f docker-compose.local.yml build --parallel kibana elasticsearch
docker-compose -f docker-compose.local.yml up --build -d kibana;
echo -e 🍻🍺🎉 "\033[32mBuild finished\t-\tNumber:0\033[0m" 🍻🍺🎉; 

trap ctrl_c INT

function ctrl_c() {
    echo -e "\n"⌚🛑 "\033[5;91mWait for docker-elk to turn off!\033[0m" 🛑⌛
    docker-compose -f docker-compose.local.yml down -v
    docker image prune -f;
    echo -e "🙏 \033[34mThank you for using dev.sh tool 🙏\033[0m"
}

function check_log() {
    echo -e ⌚🛑 "\033[5;91mWait for kibana to turn on!\033[0m" 🛑⌛
    ( docker-compose -f docker-compose.local.yml logs -f kibana & ) | grep -q "http server running at http://0.0.0.0:5601"
    echo -e  "👍 \033[32mKibana is up and ready to be tested!\033[0m 💻"
    echo -e ⏩⏩⏩ "\033[5;96mBuild on update\033[0m"
}

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

#!/bin/bash
i=$((i+1))

while inotifywait -qqre modify "$(pwd)"; 
do 
    echo -e "\n" 🏃‍♂️🏃‍♀️🏃‍♂️ "\033[32mStart Building\t-\tNumber:$i\033[0m" ⛏⚒🛠;
    docker-compose -f docker-compose.local.yml up --build -d kibana; 
    echo -e 🍻🍺🎉 "\033[32mBuild finished\t-\tNumber:$i\033[0m" 🍻🍺🎉;
    echo -e ✔ "\033[100mGit Branch\033[0m"
    git branch;
    i=$((i+1))
    check_log &
done