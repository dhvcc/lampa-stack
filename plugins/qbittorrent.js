(function () {
  "use strict";

  /**
   * Create FormData object for qBittorrent API requests
   * @param {string|string[]} hashes - Single torrent hash or array of hashes
   * @param {Object} additionalParams - Additional parameters to include in form data
   * @returns {FormData} FormData object ready for API request
   */
  function createFormData(hashes, additionalParams = {}) {
    const formData = new FormData();
    formData.append(
      "hashes",
      Array.isArray(hashes) ? hashes.join("|") : hashes
    );

    Object.entries(additionalParams).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return formData;
  }

  /**
   * Format seconds into human readable time string
   */
  function formatETA(seconds) {
    if (seconds < 0 || seconds === 8640000) return "∞";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = "";

    if (hours > 0) {
      result += hours + "h";
      if (minutes > 0) result += minutes + "m";
    } else if (minutes > 0) {
      result += minutes + "m";
      if (secs > 0) result += secs + "s";
    } else {
      result = secs + "s";
    }

    return result;
  }

  /**
   * Format torrent status into human readable string with emoji
   */
  function formatStatus(status) {
    if (status === "stalledUP") return "🌱 Seeding";
    if (status === "stoppedUP") return "✅ Done";
    if (status === "missingFiles") return "⚠️ Missing Files";
    if (status === "stoppedDL") return "⏹️ Stopped";
    if (status === "downloading") return "📥 Downloading";
    if (status === "stalledDL") return "🕔 Stalled";
    if (status === "checkingDL") return "🔍 Checking Disk Files";
    if (status === "uploading") return "📤 Uploading";
    if (status === "metaDL") return "📝 Metadata";
    return status;
  }

  class QBitTorrent {
    constructor() {
      this.network = new Lampa.Reguest();
      this.baseUrl = window.location.origin + "/qbittorrent";
      this.syncInterval = null;
    }

    clear() {
      this.network.clear();
    }

    login(success, fail) {
      this.clear();
      return this.network.silent(
        this.baseUrl + "/api/v2/auth/login",
        (result) => {
          if (success) success(result);
        },
        (error) => {
          // Somehow it errors but it's all good
          if (error.status === 200) {
            success(error);
            return;
          }

          console.error("[QBitTorrent] Authentication error:", error);
          if (fail) fail(error);
        },
        "username=admin&password=admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    }

    start(hashes) {
      this.clear();
      return this.network.silent(
        this.baseUrl + "/api/v2/torrents/resume",
        () => {},
        (error) => {
          console.error("[QBitTorrent] Failed to start torrent:", error);
        },
        createFormData(hashes),
        {
          dataType: "text",
        }
      );
    }

    pause(hashes) {
      this.clear();
      return this.network.silent(
        this.baseUrl + "/api/v2/torrents/pause",
        () => {},
        (error) => {
          console.error("[QBitTorrent] Failed to pause torrent:", error);
        },
        createFormData(hashes),
        {
          dataType: "text",
        }
      );
    }

    delete(hashes, deleteFiles = true) {
      this.clear();
      return this.network.silent(
        this.baseUrl + "/api/v2/torrents/delete",
        () => {},
        (error) => {
          console.error("[QBitTorrent] Failed to delete torrent:", error);
        },
        createFormData(hashes, { deleteFiles }),
        {
          dataType: "text",
        }
      );
    }

    sync(success, fail) {
      this.clear();
      this.network.silent(
        this.baseUrl + "/api/v2/sync/maindata",
        (data) => {
          if (!data.torrents) {
            if (fail) fail("No torrent data received");
            return;
          }

          const processed = {};

          Object.entries(data.torrents).forEach(([hash, torrent]) => {
            const progress = Math.round(torrent.progress * 100);
            const dlSpeed = (torrent.dlspeed / (1024 * 1024)).toFixed(2);

            processed[hash] = {
              time: torrent.added_on * 1000,
              status: formatStatus(torrent.state),
              state: torrent.state,
              progress: progress,
              size: torrent.size,
            };

            if (torrent.state === "downloading") {
              processed[hash].dl = dlSpeed;
              processed[hash].eta = formatETA(torrent.eta);
            }
          });
          Lampa.Storage.set("qbit_torrents", processed);

          if (success) success(processed);
        },
        (error) => {
          console.error("[QBitTorrent] Failed to get torrent list:", error);
          if (fail) fail(error);
        },
        undefined,
        {
          withCredentials: true,
        }
      );
    }

    startAutoSync(interval = 2000) {
      this.stopAutoSync();
      this.syncInterval = setInterval(() => this.sync(), interval);
    }

    stopAutoSync() {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
    }
  }

  function initializeQBitTorrent() {
    console.info("[QBitTorrent] Initializing QBitTorrent plugin");

    const qbit = new QBitTorrent();

    // Initial login and sync
    qbit.login(
      () => {
        console.info("[QBitTorrent] Successfully logged in");
        qbit.sync(
          () => {
            console.info("[QBitTorrent] Initial sync complete");
            qbit.startAutoSync();
          },
          (error) => {
            console.error("[QBitTorrent] Initial sync failed:", error);
            Lampa.Noty.show("Failed to sync with QBitTorrent");
          }
        );
      },
      (error) => {
        console.error("[QBitTorrent] Login failed:", error);
        Lampa.Noty.show("Failed to connect to QBitTorrent");
      }
    );
  }

  // Plugin manifest
  const manifest = {
    name: "QBitTorrent",
    version: "1.0.0",
    description: "QBitTorrent integration for Lampa",
    author: "dhvcc",
    type: "plugin",
    init: initializeQBitTorrent,
  };

  // Register plugin
  window.qbittorrent_plugin = true;
  Lampa.QBitTorrent = new QBitTorrent();
  Lampa.Manifest.plugins = manifest;

  if (!window.qbittorrent_plugin_loaded) {
    initializeQBitTorrent();
    window.qbittorrent_plugin_loaded = true;
  }
})();
