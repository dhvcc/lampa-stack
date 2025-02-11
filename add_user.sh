#!/bin/bash

set -e

lampac_local_api_url="http://localhost:9118"

# Get CUB account email
read -p "Enter CUB account email: " cub_email

# Generate random password
admin_pass=$(LC_ALL=C tr -dc 'A-Za-z0-9!?%=' < /dev/urandom | head -c 10)


# Check for docker compose command availability
if command -v docker compose >/dev/null 2>&1; then
    compose_cmd="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    compose_cmd="docker-compose" 
else
    echo "No docker compose installation found. Please install docker compose first."
    exit 1
fi

# Wait for lampac-api service to be ready and check existing password
retries=0
while [ $retries -lt 5 ]; do
    response=$($compose_cmd exec -T lampac-api curl --fail -s "$lampac_local_api_url/storage/get?path=backup&account_email=$cub_email")
    if [ $? -eq 0 ]; then
        if echo "$response" | grep -q "stack_password"; then
            read -p "Password already exists. Do you want to update it? [y/N] " update_pass
            if [[ ! $update_pass =~ ^[Yy]$ ]] && [[ ! $update_pass =~ ^[Yy][Ee][Ss]$ ]]; then
                echo "Keeping existing password"
                exit 0
            fi
        fi
        break
    fi
    retries=$((retries + 1))
    sleep 1
done

if [ $retries -eq 5 ]; then
    echo "lampac-api service failed to start after 5 retries"
    exit 1
fi

# Set credentials and email in storage
$compose_cmd exec -T lampac-api curl --fail -s -o /dev/null -X POST "http://localhost:9118/storage/set?path=backup&account_email=$cub_email" \
    -H "Content-Type: application/json" \
    -d "{\"lampa_stack_user\":\"$cub_email\",\"lampa_stack_password\":\"$admin_pass\"}"

# Create htpasswd file in nginx container
$compose_cmd exec -T nginx sh -c "echo -n '$cub_email:' >> /etc/nginx/pass/.htpasswd && echo '$admin_pass' | openssl passwd -apr1 -stdin >> /etc/nginx/pass/.htpasswd"

echo
echo "Password for $cub_email set to: $admin_pass"
echo "*************************************************************************************************************"
echo "Remember to NOT EXPOSE your stack to the public internet unless you're using SSL and know what your are doing"
echo "*************************************************************************************************************"