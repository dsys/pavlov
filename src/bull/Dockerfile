FROM node:8
MAINTAINER Jackson Callaway <jackson@cleargraph.com>

COPY config.json /opt/config.json
WORKDIR /opt

RUN git clone https://github.com/bee-queue/arena.git \
    && cd arena \
    && npm install

ENV REDIS_URL redis://redis:6379/0
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
CMD [ "/docker-entrypoint.sh" ]
