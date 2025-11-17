# Stage 1: Produktions-Umgebung (Webserver)
FROM nginx:alpine

# Lösche das Standard-Nginx-Verzeichnis
RUN rm -rf /usr/share/nginx/html/*

# Kopiere den Inhalt unseres 'dist'-Ordners (den der CI-Build-Job erstellt hat)
# in das Web-Root-Verzeichnis von Nginx.
# Wir erwarten, dass der 'dist'-Ordner im Build-Kontext liegt.
COPY dist/ /usr/share/nginx/html/

# Port 80 freigeben
EXPOSE 80

# Nginx starten
CMD ["nginx", "-g", "daemon off;"]