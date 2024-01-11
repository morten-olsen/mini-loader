#!/bin/sh

CMD=$@
UID=${UID:-1001}
GID=${GID:-1001}

addgroup --system --gid ${GID} nodejs && \
adduser --system --uid ${UID} -G nodejs miniloader && \

mkdir -p /app/data
chown -R miniloader:nodejs /app/data
su miniloader -s /bin/sh -c "$CMD"