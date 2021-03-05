ARG ELK_VERSION

FROM node:latest as node

WORKDIR /usr/kibana/plugin

ADD plugin/agent-controller /usr/kibana/plugin/agent-controller

WORKDIR /usr/kibana/plugin/agent-controller

RUN npm install

WORKDIR  /usr

RUN apt -y install zip

RUN zip -r agent-controller_$ELK_VERSION.zip kibana

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

COPY --from=node /usr/agent-controller.zip /usr/share/kibana/agent-controller.zip

ADD config/kibana.yml /usr/share/kibana/config/kibana.yml

# Add your kibana plugins setup here
RUN kibana-plugin install <name|url>
