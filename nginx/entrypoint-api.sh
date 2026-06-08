#!/bin/sh
# Démarre nginx en mode HTTPS si les certificats existent, sinon en HTTP (proxy simple)
CERT_FILE="/etc/letsencrypt/live/82.165.31.102.sslip.io/fullchain.pem"

if [ -f "$CERT_FILE" ]; then
    echo "Certificats SSL trouvés → mode HTTPS"
    cp /etc/nginx/nginx-ssl.conf /etc/nginx/nginx.conf
else
    echo "Pas de certificats SSL → mode HTTP (proxy direct vers le backend)"
    cat > /etc/nginx/nginx.conf << 'EOF'
events { worker_connections 1024; }
http {
    client_max_body_size 20M;
    upstream backend { server backend:8080; }
    server {
        listen 80;
        server_name _;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / {
            proxy_pass         http://backend/;
            proxy_set_header   Host              $host;
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_read_timeout 120s;
        }
    }
}
EOF
fi

exec nginx -g "daemon off;"
