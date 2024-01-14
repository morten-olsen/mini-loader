#!/bin/sh

CMD=$@
UID=${UID:-1001}
GID=${GID:-1001}

addgroup --system --gid ${GID} nodejs && \
adduser --system --uid ${UID} -G nodejs miniloader && \

mkdir -p ${DATA_DIR}
mkdir -p ${CACHE_DIR}
chown -R miniloader:nodejs ${DATA_DIR}
chown -R miniloader:nodejs ${CACHE_DIR}
su miniloader -s /bin/sh -c "$CMD"