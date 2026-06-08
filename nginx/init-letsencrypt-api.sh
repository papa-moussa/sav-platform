#!/bin/bash
# Initialisation SSL Let's Encrypt pour 82.165.31.102.sslip.io
# A exécuter UNE SEULE FOIS sur le VPS après le premier démarrage de nginx (mode HTTP)
# Usage : sudo bash nginx/init-letsencrypt-api.sh

set -e

DOMAIN="82.165.31.102.sslip.io"
EMAIL="contact@sama-sav.com"
STAGING=0   # Passe à 1 pour tester sans atteindre la limite Let's Encrypt

STAGING_FLAG=""
if [ $STAGING -eq 1 ]; then
    STAGING_FLAG="--staging"
    echo ">>> MODE STAGING (test)"
fi

# 1. Démarrer nginx en mode HTTP temporaire pour valider le challenge
echo ">>> Démarrage nginx (mode HTTP temporaire)..."
cat > /tmp/nginx-temp.conf << 'EOF'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name _;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'OK'; add_header Content-Type text/plain; }
    }
}
EOF

docker run -d --rm --name sav_nginx_temp \
    -p 80:80 \
    -v certbot_www:/var/www/certbot \
    -v /tmp/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
    nginx:alpine

sleep 3

# 2. Générer le certificat
echo ">>> Obtention du certificat SSL pour $DOMAIN..."
docker run --rm \
    -v certbot_certs:/etc/letsencrypt \
    -v certbot_www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    $STAGING_FLAG \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# 3. Télécharger les paramètres SSL recommandés
echo ">>> Configuration des paramètres SSL..."
docker run --rm \
    -v certbot_certs:/etc/letsencrypt \
    certbot/certbot sh -c "
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
             -o /etc/letsencrypt/options-ssl-nginx.conf
        openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
    "

# 4. Arrêter nginx temporaire et démarrer la stack complète
echo ">>> Arrêt nginx temporaire..."
docker stop sav_nginx_temp 2>/dev/null || true

echo ">>> Démarrage de la stack avec SSL..."
export IMAGE_TAG=${IMAGE_TAG:-latest}
docker compose -f docker-compose.backend.yml up -d

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  SSL configuré avec succès !                             ║"
echo "║                                                          ║"
echo "║  https://82.165.31.102.sslip.io → Backend API           ║"
echo "║  https://82.165.31.102.sslip.io/actuator/health         ║"
echo "║  https://82.165.31.102.sslip.io/swagger-ui.html         ║"
echo "╚══════════════════════════════════════════════════════════╝"
