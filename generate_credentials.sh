#!/bin/bash

# Generate random credentials
USERNAME="admin"
PASSWORD=$(openssl rand -base64 12)

# Create torrserver credentials file
cat > torrserver.accs.db.json << EOF
{
    "${USERNAME}": "${PASSWORD}"
}
EOF

# Update qBittorrent config with hashed password
# qBittorrent uses PBKDF2 with SHA512, with the format being salt:hash in base64
SALT=$(openssl rand -hex 16)
# Generate PBKDF2 hash with 100000 iterations (qBittorrent default)
HASHED_PASS=$(echo -n "${PASSWORD}" | openssl pkeyutl -kdf pbkdf2 -kdflen 64 -pkeyopt digest:SHA512 -pkeyopt iterations:100000 -pkeyopt pass:"${PASSWORD}" -pkeyopt salt:"${SALT}" 2>/dev/null | base64)
SALT_B64=$(echo -n "${SALT}" | xxd -r -p | base64)
FINAL_HASH="${SALT_B64}:${HASHED_PASS}"

# Update the qBittorrent config file
# Using perl for more reliable handling of special characters in base64 strings
# perl -pi -e "s#WebUI\\\\Password_PBKDF2=\"\@ByteArray\([^)]+\)\"#WebUI\\\\Password_PBKDF2=\"\@ByteArray(${FINAL_HASH})\"#g" qBittorrent.patch.conf

# Output credentials and instructions
echo "Generated credentials:"
echo "Username: ${USERNAME}"
echo "Password: ${PASSWORD}"
echo ""
echo "Please go to lampa settings -> torrents and input these credentials"
echo "The credentials have been saved to torrserver.accs.db.json and qBittorrent.patch.conf"
