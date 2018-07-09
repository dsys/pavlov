FROM ubuntu:16.04
MAINTAINER Alex Kern <alex@pavlov.ai>

ENV NODE_ENV=development \
    VERBOSE=true \
    PRETTY_LOGS=true \
    PATH=/mono/bin:/mono/node_modules/.bin:/mono/src/console/node_modules/.bin:/mono/tmp/volumes/python-deps/bin:/root/go/bin:/usr/local/go/bin:/usr/lib/spark/bin:$PATH \
    PYTHONPATH=/mono/src/py:/mono/tmp/volumes/python-deps/lib/python3.5/site-packages:/usr/lib/spark/python:/usr/lib/spark/python/lib/py4j-0.10.4-src.zip:$PYTHONPATH \
    GOPATH=/mono:/root/go \
    LC_ALL=C.UTF-8 \
    JAVA_VERSION=1.7 \
    SPARK_HOME=/usr/lib/spark

RUN apt-get update && \
    apt-get install -y -qq \
      apt-transport-https build-essential git git-crypt curl wget unzip \
      python3-pip python3.5-dev python-software-properties \
      libpq-dev \
      ocaml libelf-dev \
      imagemagick && \
	  echo "deb http://packages.cloud.google.com/apt cloud-sdk-xenial main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list && \
    echo "deb [arch=amd64] http://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    curl https://bazel.build/bazel-release.pub.gpg | apt-key add - && \
    apt-get update && \
    apt-get install -y -qq openjdk-8-jdk bazel google-cloud-sdk yarn && \
    pip3 install --upgrade pip awscli && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs docker.io && \
    curl -sL https://storage.googleapis.com/golang/go1.8.linux-amd64.tar.gz | tar -C /usr/local -zxvf - && \
    mkdir -p /root/go/bin && \
    curl -OL https://github.com/google/protobuf/releases/download/v3.2.0/protoc-3.2.0-linux-x86_64.zip && \
    unzip protoc-3.2.0-linux-x86_64.zip -d protoc3 && \
    mv protoc3/bin/protoc /usr/bin/protoc && \
    rm -rf \
      protoc-3.2.0-linux-x86_64.zip \
      protoc3 \
      /tmp/* \
      /var/lib/apt/lists/* && \
    mkdir -p /mono

RUN go get -u -d github.com/mattes/migrate/cli github.com/lib/pq && \
    go build -tags 'postgres' -o /usr/local/bin/migrate github.com/mattes/migrate/cli && \
    rm -rf /mono/src

COPY docker-entrypoint.sh /
WORKDIR /mono
ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "bash" ]
