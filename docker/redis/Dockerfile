FROM redis
COPY redis.conf /usr/local/etc/redis/redis.conf
RUN mkdir -p /var/log/redis
RUN mkdir -p /usr/local/var/db/redis
CMD [ "redis-server" ]
# CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
