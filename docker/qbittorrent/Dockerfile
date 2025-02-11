FROM ghcr.io/hotio/qbittorrent

COPY ./init.patch /init
# Moving to tmp to avoid being conflicted with a volume
COPY ./jackett.patch.py /tmp/jackett.patch.py
COPY ./qBittorrent.conf /tmp/qBittorrent.patch.conf
