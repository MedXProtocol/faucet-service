#!/bin/sh
set -e
user=faucet
repo="$FAUCET_PATH"

if [ `id -u` -eq 0 ]; then
  echo "Changing user to $user"
  # ensure folder is writable
  su-exec "$user" test -w "$repo" || chown -R -- "$user" "$repo"
  # restart script with new privileges
  exec su-exec "$user" "$0" "$@"
fi

################ EVERYTHING ABOVE ORIGINAL

default_origins='["*"]'
origins=${FAUCET_CONFIG_API_CORS_ORIGINS:-$default_origins}
echo "Using CORS origins: $origins"

# Configure server_names origins here
# faucet config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
# faucet config --json API.HTTPHeaders.Access-Control-Allow-Origin "$origins"

################ EVERYTHING BELOW ORIGINAL

exec faucet daemon "$@"
