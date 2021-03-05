FROM node:latest as node

ARG ELK_VERSION

WORKDIR /usr/kibana/plugin

ADD plugin/agent-controller /usr/kibana/plugin/agent-controller

WORKDIR /usr/kibana/plugin/agent-controller

# RUN npm install

WORKDIR  /usr

RUN apt update

RUN apt -y install zip

RUN zip -r agent-controller.zip kibana

RUN ls

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

ARG ELK_VERSION

COPY --from=node /usr/agent-controller.zip /usr/share/kibana/agent-controller.zip

RUN mv /usr/share/kibana/agent-controller.zip /usr/share/kibana/agent-controller-${ELK_VERSION}.zip

RUN ls /usr/share/kibana/

ADD config/kibana.yml /usr/share/kibana/config/kibana.yml

# Add your kibana plugins setup here
RUN kibana-plugin install file:///usr/share/kibana/agent-controller-${ELK_VERSION}.zip
