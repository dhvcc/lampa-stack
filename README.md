
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

This is intended to be run **locally**. It's **not secure enough** to be exposed to the internet.

## Patch list

**Lampa**
- Automatic TorrServer setup and configuration
- Automatic setup of torrent parsers (jacred.xyz)
- Default plugins (unofficial plugin store + couple of quality of life plugins)
- Default (better IMO) menu items with optional stuff hidden
- QBitTorrent integration (ability to "Start download" from the torrent list, instead of only adding it to the list of TorrServer torrents to be streamed)
- 2 online plugins enabled by default (Lampac Online & nb557's online plugin)
- Integration with local Jackett by default with jacred.xyz and redapi.cfhttp.top fallbacks
- Added Local Jackett as an option to the pubtorr plugin (public parser list you see in the settings)
<img width="1632" alt="image" src="https://github.com/user-attachments/assets/ead787ea-ec33-4f09-b453-0fc79c2ebec9" />
- Torrent status in "My torrents" tab, including size, DL speed + ETA. Additional options to start/pause download (qbittorrent) and delete torrent from both qbit and torrserver
<img width="1628" alt="image" src="https://github.com/user-attachments/assets/14c584a6-bc13-4a5a-b778-5a7447cc51ec" />

**QBitTorrent**
- jacred.xyz Jackett search integration
- VueTorrent enabled by default
<img width="1625" alt="image" src="https://github.com/user-attachments/assets/fafc7ecb-bf51-43a1-b1e6-ebb955c5c259" />


**TorrServer**
- Ability to stream already downloaded torrents without downloading them again (using a shared volume with QBitTorrent)

### Disclaimer

This software is provided "as is" without warranty of any kind, either expressed or implied. The entire responsibility for the content accessed, downloaded, or streamed through this software lies with the end user. The developers and maintainers of this project do not provide any content, nor are they responsible for how this software is used. Users must ensure they have the necessary rights and comply with their local laws and regulations when using this software.

---

#### TODO
- [ ] Lampac proxy all online requests
- [ ] Custom built Lampac API (With default to avoid admin manifest install and routes restricted only to necessary API) & Online mod
- [ ] Crash dumps saved in Lampa to be able to investigate them
- [ ] Don't silence console.errors in lampa (adds to the above ^)
- [] Add bracketed names for logging in dev console, but not in "Lampa console" (like [Lampa stack]). Makes easier to filter **Might be a PR**
- [ ] More info on the above shelf ^
- [ ] LME translations for Shikimori & pubtorr **Might be a PR**
- [ ] Add vuetorrent webui manually, don't use custom image

- [X] ~~Option to deploy with SSL (presigned/letsencrypt)~~ No need, user can proxy the stack with SSL. Other work to prevent hardcoded addresses was already done
- [X] Custom Jackett and parser fallbacks
- [X] Fix timeouts in local Jackett (AniLibria times out pretty mentally)
- [X] Update Home to have a "Downloaded torrents" shelf **Might be a PR**
- [X] Proxy with NGINX to avoid CORS
- [X] ~~Avoid hardcoding qbittorrent credentials (I guess we'd need to share them using volumes)~~ Now using nginx to proxy qbittorrent with localhost auth disabled
- [X] Option to run on a different port from 80 (for users who deploy a lot of self hosted services, their 80 may be busy by default)

