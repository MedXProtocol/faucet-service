#! /bin/sh
mkdir -p /docker/etc/nginx/conf.d
cp nginx.conf.d/faucet.medcredits.io.conf /docker/etc/nginx/conf.d/
cd docker
docker-compose up --build
cd ..
