echo "Docker Hub Login"
docker login

echo "Build Cache"
docker build -f kibana/Dockerfile.cache -t ezeutno/kibana-cache:alpine kibana

echo "Push Docker Image"
docker push ezeutno/kibana-cache:alpine