FROM nginx:alpine

# Copier les deux configs (HTTP et HTTPS)
COPY nginx-http.conf /etc/nginx/nginx-http.conf
COPY nginx-ssl.conf  /etc/nginx/nginx-ssl.conf
COPY spa.conf        /etc/nginx/spa.conf

# Entrypoint qui choisit automatiquement HTTP ou HTTPS
COPY entrypoint.sh   /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
