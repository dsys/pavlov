FROM node:8
MAINTAINER Alex Kern <alex@pavlov.ai>

ENV NODE_ENV=production HTTP_PORT=80
EXPOSE 80 8888

COPY . /opt/src
WORKDIR /opt

RUN mv src/package.json src/yarn.lock . && \
    NODE_ENV=development yarn && \
    ./node_modules/.bin/babel -v -D -s \
      --ignore node_modules,__tests__,__mocks__ \
      --out-dir dist src && \
    ./node_modules/.bin/babel-node \
      --max_old_space_size=16384 -- \
      ./node_modules/.bin/webpack \
        --config dist/webpack.config.js \
        --output-path dist/static \
        src/browser/index.js && \
    yarn install --production --ignore-scripts --prefer-offline && \
    rm -rf /opt/src

CMD node dist/index.js
