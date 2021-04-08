ARG ELK_VERSION

FROM node:14.16.0 as node

ARG ELK_VERSION

RUN apt update

RUN apt install -y git

WORKDIR /usr/app/

RUN git clone --single-branch --depth=1 --branch 7.11 https://github.com/elastic/kibana.git

WORKDIR /usr/app/kibana

RUN yarn kbn bootstrap

COPY plugin/agent_controller /usr/app/kibana/plugins/agent_controller

WORKDIR /usr/app/kibana/plugins/agent_controller

RUN  echo ${ELK_VERSION} | node ../../scripts/plugin_helpers.js build

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

ARG ELK_VERSION

COPY --from=node /usr/app/kibana/plugins/agent_controller/build/agentController-${ELK_VERSION}.zip /usr/share/kibana/agentController-${ELK_VERSION}.zip

ADD config/kibana.yml /usr/share/kibana/config/kibana.yml

# Add your kibana plugins setup here
RUN kibana-plugin install file:///usr/share/kibana/agentController-${ELK_VERSION}.zip

RUN rm /usr/share/kibana/agentController-${ELK_VERSION}.zip
