FROM openresty/openresty:alpine

# Install required Lua modules
RUN apk add --no-cache git \
    && cd /tmp \
    && git clone https://github.com/ledgetech/lua-resty-http \
    && cd lua-resty-http \
    && mkdir -p /usr/local/openresty/lualib/resty \
    && cp lib/resty/http* /usr/local/openresty/lualib/resty/ \
    && cd / \
    && rm -rf /tmp/lua-resty-http \
    && apk del git

# Create directory for Lua modules
RUN mkdir -p /etc/nginx/lua

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY variables.conf.template /etc/nginx/templates/10-variables.conf.template
COPY auth.lua /etc/nginx/lua/auth.lua
