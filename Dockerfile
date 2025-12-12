# Nutzt direkt das sichere Image (läuft standardmäßig auf Port 8080 als User 'nginx')
FROM nginxinc/nginx-unprivileged:alpine

# Einfach nur kopieren (User ist schon richtig eingestellt)
COPY dist/ /usr/share/nginx/html/

# Port 8080 ist bei diesem Image Standard
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]