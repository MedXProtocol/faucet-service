FROM nginx
RUN mkdir -p /var/www/letsencrypt
RUN mkdir -p /etc/nginx/conf.d/faucet-service
COPY default.conf /etc/nginx/conf.d
COPY index.html /var/www
VOLUME /var/www/letsencrypt
VOLUME /etc/nginx/conf.d/faucet-service
