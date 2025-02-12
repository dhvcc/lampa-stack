FROM openresty/openresty:focal

# Install required Lua modules
RUN apt-get update && apt-get install -y git \
    && cd /tmp \
    && git clone https://github.com/ledgetech/lua-resty-http \
    && cd lua-resty-http \
    && mkdir -p /usr/local/openresty/lualib/resty \
    && cp lib/resty/http* /usr/local/openresty/lualib/resty/ \
    && cd / \
    && rm -rf /tmp/lua-resty-http \
    && apt-get remove -y git \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Create directory for Lua modules
RUN mkdir -p /etc/nginx/lua

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY variables.conf.template /etc/nginx/templates/10-variables.conf.template
COPY variables.conf.template /etc/nginx/conf.d/variables.conf.template
COPY auth.lua /etc/nginx/lua/auth.lua
