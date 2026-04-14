#!/bin/bash
# Script d'initialisation Let's Encrypt — à exécuter UNE SEULE FOIS sur le VPS
# Usage : sudo bash nginx/init-letsencrypt.sh

set -e

DOMAINS="sama-sav.com www.sama-sav.com app.sama-sav.com admin.sama-sav.com api.sama-sav.com"
EMAIL="contact@sama-sav.com"   # ← Mets ton email ici
STAGING=0                        # Passe à 1 pour tester sans limite Let's Encrypt

# ─────────────────────────────────────────────
# 1. Créer un nginx.conf temporaire HTTP-only
#    (sans SSL) pour que nginx puisse démarrer
# ─────────────────────────────────────────────
echo ">>> Création du nginx.conf temporaire (HTTP seulement)..."
cat > ./nginx/nginx-temp.conf << 'EOF'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name _;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'OK - Initialisation SSL en cours...'; add_header Content-Type text/plain; }
    }
}
EOF

# ─────────────────────────────────────────────
# 2. Copier le vrai nginx.conf de côté, utiliser le temp
# ─────────────────────────────────────────────
cp ./nginx/nginx.conf ./nginx/nginx.conf.bak
cp ./nginx/nginx-temp.conf ./nginx/nginx.conf

# Patcher le Dockerfile nginx pour utiliser ce conf temporaire
echo ">>> Démarrage de nginx (mode HTTP temporaire)..."
docker compose up -d --build nginx certbot

sleep 5

# ─────────────────────────────────────────────
# 3. Générer les certificats Let's Encrypt
# ─────────────────────────────────────────────
STAGING_FLAG=""
if [ $STAGING -eq 1 ]; then
    STAGING_FLAG="--staging"
    echo ">>> MODE STAGING (test sans limite)"
fi

echo ">>> Obtention des certificats SSL..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    $STAGING_FLAG \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    $(for d in $DOMAINS; do echo -n "-d $d "; done)

echo ">>> Certificats obtenus !"

# ─────────────────────────────────────────────
# 4. Télécharger les fichiers SSL recommandés
# ─────────────────────────────────────────────
echo ">>> Téléchargement des paramètres SSL recommandés..."
docker compose run --rm certbot sh -c "
    if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
        curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
             -o /etc/letsencrypt/options-ssl-nginx.conf
    fi
    if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
        openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
    fi
"

# ─────────────────────────────────────────────
# 5. Restaurer le vrai nginx.conf avec SSL
# ─────────────────────────────────────────────
echo ">>> Restauration du nginx.conf avec SSL..."
cp ./nginx/nginx.conf.bak ./nginx/nginx.conf
rm -f ./nginx/nginx.conf.bak ./nginx/nginx-temp.conf

# ─────────────────────────────────────────────
# 6. Redémarrer nginx avec SSL activé
# ─────────────────────────────────────────────
echo ">>> Redémarrage de nginx avec SSL..."
docker compose up -d --build nginx

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  SSL configuré avec succès !                         ║"
echo "║                                                      ║"
echo "║  https://sama-sav.com       → Landing               ║"
echo "║  https://app.sama-sav.com   → Application           ║"
echo "║  https://admin.sama-sav.com → Administration        ║"
echo "║  https://api.sama-sav.com   → API Backend           ║"
echo "╚══════════════════════════════════════════════════════╝"
