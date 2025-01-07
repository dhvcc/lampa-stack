
# Lampa Stack

All-in-one Lampa player with custom patches to enable deep integration with TorrServer/QBitTorrent and ease of setup and use.

## Run

```bash
git clone https://github.com/dhvcc/lampa-stack.git
cd lampa-stack
docker compose up # or docker-compose up
```

### Networking

Since this is going to be run locally exposed **only to the local network**, to access the address on the other devices you'll possibly need to set a manual IP address within this network to avoid constant IP rotation.

On MacOS this can be done by setting manual IP with DHCP using `networksetup` command. "Wi-Fi" is the name of the network interface. And `192.168.0.155` is the IP address you want to set.

```zsh
sudo networksetup -setmanualwithdhcprouter "Wi-Fi" 192.168.0.155
```

### A note on security

This is intended to be run locally. It's not secure enough to be exposed to the internet.

## Patch list

TODO

-----

### Disclaimer

This software is provided "as is" without warranty of any kind, either expressed or implied. The entire responsibility for the content accessed, downloaded, or streamed through this software lies with the end user. The developers and maintainers of this project do not provide any content, nor are they responsible for how this software is used. Users must ensure they have the necessary rights and comply with their local laws and regulations when using this software.

---

#### TODO
- [X] Proxy with NGINX to avoid CORS
- [ ] Avoid hardcoding qbittorrent credentials (I guess we'd need to share them using volumes)
- [ ] Add vuetorrent webui manually, don't use custom image

- [ ] Option to deploy with SSL (presigned/letsencrypt)

