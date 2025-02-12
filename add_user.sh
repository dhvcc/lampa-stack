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

# Get username
read -p "Enter username: " username

password_exists=false
# Check if password already exists for user
if $compose_cmd exec -T nginx cat /etc/nginx/pass/.htpasswd 2>/dev/null | grep -q "^$username:"; then
    password_exists=true
    read -p "Password already exists. Do you want to update it? [y/N] " update_pass
    if [[ ! $update_pass =~ ^[Yy]$ ]] && [[ ! $update_pass =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Keeping existing password"
        exit 0
    fi
fi

# Ask if user wants to input password manually
read -p "Do you want to input password manually? [y/N] " manual_pass
if [[ $manual_pass =~ ^[Yy]$ ]] || [[ $manual_pass =~ ^[Yy][Ee][Ss]$ ]]; then
    read -s -p "Enter password: " password
    echo
else
    # Password will be auto-generated
    auto_generated=true
    password=$(LC_ALL=C tr -dc 'A-Za-z0-9!?%=' < /dev/urandom | head -c 10)
fi

if [ "$password_exists" = true ]; then
    # Remove existing user and add new user
    $compose_cmd exec -T nginx sh -c "grep -v '^$username:' /etc/nginx/pass/.htpasswd > /etc/nginx/pass/.htpasswd.tmp && mv /etc/nginx/pass/.htpasswd.tmp /etc/nginx/pass/.htpasswd && echo -n '$username:' >> /etc/nginx/pass/.htpasswd && echo '$password' | openssl passwd -apr1 -stdin >> /etc/nginx/pass/.htpasswd"
else
    # Add new user
    $compose_cmd exec -T nginx sh -c "echo -n '$username:' >> /etc/nginx/pass/.htpasswd && echo '$password' | openssl passwd -apr1 -stdin >> /etc/nginx/pass/.htpasswd"
fi


echo
if [ "$auto_generated" = true ]; then
    echo "Password for user $username set to $password"
else
    echo "Password for user $username was set"
fi
echo "*************************************************************************************************************"
echo "Remember to NOT EXPOSE your stack to the public internet unless you're using SSL and know what your are doing"
echo "*************************************************************************************************************"