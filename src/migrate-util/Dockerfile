FROM golang:1.9
MAINTAINER Alex Kern <alex@cleargraph.com>

RUN apt-get update && \
    apt-get install -y -qq git && \
    go get -u -d github.com/mattes/migrate/cli github.com/lib/pq && \
    go build -tags 'postgres' -o /usr/local/bin/migrate github.com/mattes/migrate/cli && \
    apt-get clean

RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it
