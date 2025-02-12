#!/bin/bash

set -e

# Check for docker compose command availability
if command -v docker compose >/dev/null 2>&1; then
    compose_cmd="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    compose_cmd="docker-compose" 
else
    echo "No docker compose installation found. Please install docker compose first."
    exit 1
fi

# Get email
read -p "Enter email: " email

# Ensure the auth directory exists and add email
$compose_cmd exec -T nginx sh -c "mkdir -p /etc/nginx/auth && echo '$email' >> /etc/nginx/auth/authorized_emails.conf"
echo "Added email $email to authorized list"

echo "*************************************************************************************************************"
echo "Remember to NOT EXPOSE your stack to the public internet unless you're using SSL and know what your are doing"
echo "*************************************************************************************************************"