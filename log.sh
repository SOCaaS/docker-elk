export LOGS=$1
trap exitFunction EXIT

function exitFunction() {
    clear
    docker-compose -f docker-compose.local.yml logs -f $LOGS
    $(exitFunction());
}

docker-compose -f docker-compose.local.yml logs -f $LOGS