FROM ghcr.io/hotio/qbittorrent

COPY ./init.patch /init
# Moving to tmp to avoid being conflicted with a volume
COPY ./jackett.patch.py /tmp/jackett.patch.py
COPY ./qBittorrent.patch.conf /tmp/qBittorrent.patch.conf
# COPY ./qBittorrent.patch.conf /config/config/qbittorrent.patch.conf
