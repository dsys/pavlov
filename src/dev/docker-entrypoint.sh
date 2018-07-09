#! /bin/bash

set -euo pipefail

# use the container's corresponding babel cache
export BABEL_CACHE_PATH=/mono/tmp/volumes/babel-cache/$HOSTNAME.json

# cd into the correct subdirectory
CD=${CD:-}
if [[ -n "$CD" ]]; then
  cd "$CD"
fi

# run the command
exec "$@"
