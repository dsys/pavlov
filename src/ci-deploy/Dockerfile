FROM google/cloud-sdk:alpine
MAINTAINER Alex Kern <alex@pavlov.ai>

ENV HELM_VERSION=2.3.0 \
    GITCRYPT_VERSION=0.5.0-2 \
    PATH=/mono/bin:$PATH

RUN apk add --no-cache \
      git \
      bash \
      curl \
      docker \
      g++ \
      git \
      gnupg \
      libstdc++ \
      make \
      openssh \
      openssl \
      openssl-dev && \
    curl -L https://storage.googleapis.com/kubernetes-release/release/v1.8.0/bin/linux/amd64/kubectl > /usr/local/bin/kubectl && \
    curl -L https://kubernetes-helm.storage.googleapis.com/helm-v2.3.0-linux-amd64.tar.gz | tar zxv -C /tmp/ && \
    curl -L https://github.com/AGWA/git-crypt/archive/debian/$GITCRYPT_VERSION.tar.gz | tar zxv -C /tmp && \
    chmod +x /usr/local/bin/kubectl && \
    mv /tmp/linux-amd64/helm /usr/local/bin/helm && \
    cd /tmp/git-crypt-debian-$GITCRYPT_VERSION && make && make install PREFIX=/usr/local && \
    rm -rf /tmp/* && \
    apk del g++ make openssl-dev

CMD [ "bash" ]
