ARG ELK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/logstash/logstash:${ELK_VERSION}

ADD logstash/config/logstash.yml /usr/share/logstash/config/logstash.yml

ADD logstash/pipeline /usr/share/logstash/pipeline

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
