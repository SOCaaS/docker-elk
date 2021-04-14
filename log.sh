export LOGS=$1

finish=0
trap 'finish=1' SIGUSR1

while [[ finish != 1 ]];
do
docker-compose -f docker-compose.local.yml logs -f $LOGS | sed -u 's/^[^|]*[^ ]* //'
done