FROM redocly/cors-anywhere

COPY ./cors-anywhere.patch.server.js /usr/src/app/server.js
COPY ./cors-anywhere.patch.lib-cors-anywhere.js /usr/src/app/lib/cors-anywhere.js
