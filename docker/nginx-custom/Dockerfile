FROM nginx
RUN mkdir -p /etc/nginx/conf.d/faucet-service
COPY default.conf /etc/nginx/conf.d
COPY index.html /var/www
VOLUME /etc/nginx/conf.d/faucet-service
