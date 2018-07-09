FROM python:3.6
MAINTAINER Alex Kern <alex@cleargraph.com>

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install -y \
       build-essential \
       checkinstall \
       curl \
       git \
       cmake \
       libsnappy-dev \
       zlib1g-dev \
       libbz2-dev \
       libgflags-dev && \
    apt-get clean

RUN cd /tmp && \
    git clone https://github.com/facebook/rocksdb.git && \
    cd rocksdb && \
    git checkout rocksdb-5.9.2 && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    make install INSTALL_PATH=/usr && \
    rm -rf /tmp/rocksdb

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY cli.py /
COPY kernns /kernns
ENTRYPOINT [ "python", "/cli.py" ]
CMD [ "server", "/kernns/indices" ]
