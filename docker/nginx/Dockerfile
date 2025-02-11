FROM nginx:1.22.1

RUN apt update && apt install -y nginx-extras

RUN rm /etc/nginx/sites-enabled/default

EXPOSE 80