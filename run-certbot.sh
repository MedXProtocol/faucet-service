#! /bin/sh
sudo docker run --rm --name certbot \
  -v /docker/certs/letsencrypt:/etc/letsencrypt \
  -v /docker/var/log/letsencrypt:/var/log/letsencrypt \
  -v /docker/var/www/letsencrypt:/var/www/.well-known \
  certbot/certbot -t certonly \
  --agree-tos --renew-by-default \
  --webroot -w /var/www \
  -n \
  -d faucet.medcredits.io
