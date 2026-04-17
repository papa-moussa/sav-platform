#!/bin/sh
# Choisit automatiquement la config HTTP ou SSL selon la présence des certificats

CERT_FILE="/etc/letsencrypt/live/sama-sav.com/fullchain.pem"
SSL_CONF="/etc/nginx/nginx-ssl.conf"
HTTP_CONF="/etc/nginx/nginx-http.conf"
ACTIVE_CONF="/etc/nginx/nginx.conf"

if [ -f "$CERT_FILE" ]; then
    echo "[nginx-entrypoint] Certificats SSL trouvés → mode HTTPS"
    cp "$SSL_CONF" "$ACTIVE_CONF"
else
    echo "[nginx-entrypoint] Pas de certificats SSL → mode HTTP (en attente de certbot)"
    cp "$HTTP_CONF" "$ACTIVE_CONF"
fi

exec nginx -g "daemon off;"
