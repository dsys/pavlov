#! /bin/bash

set -euo pipefail

sed 's|REDIS_URL|'"${REDIS_URL}"'|' -i /opt/config.json

mv /opt/config.json /opt/arena/src/server/config/index.json

cd /opt/arena && npm start
