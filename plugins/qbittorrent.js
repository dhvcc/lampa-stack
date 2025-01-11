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
    const translation_key = "torrent_status_" + status;
    const translation = Lampa.Lang.translate(translation_key);

    // If no translation found, return original status
    if (translation === translation_key) return status;

    return translation;
  }

  class QBitTorrent {
    constructor() {
      this.baseUrl = window.location.origin + "/qbittorrent";
      this.syncInterval = null;
      this.loginRetries = 0;
      this.maxLoginRetries = 3;
      this.retryDelay = 1000;
    }

    async request(endpoint, options = {}) {
      const defaults = {
        url: this.baseUrl + endpoint,
        method: "GET",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        cache: false,
      };

      try {
        return await $.ajax({ ...defaults, ...options });
      } catch (error) {
        // Only attempt login for 401/403 errors and if we haven't exceeded retries
        if (
          (error.status === 401 || error.status === 403) &&
          this.loginRetries < this.maxLoginRetries
        ) {
          console.log(
            "[QBitTorrent]",
            "Auth required (attempt",
            this.loginRetries + 1,
            "/",
            this.maxLoginRetries,
            ")"
          );

          this.loginRetries++;

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));

          // Attempt login
          await this.login();

          // Retry original request
          return await $.ajax({ ...defaults, ...options });
        }

        throw error;
      }
    }

    async login() {
      return await $.ajax({
        url: this.baseUrl + "/api/v2/auth/login",
        method: "POST",
        data: "username=admin&password=admin",
        contentType: "application/x-www-form-urlencoded",
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        cache: false,
      });
    }

    start(hashes) {
      return this.request("/api/v2/torrents/start", {
        method: "POST",
        data: createFormData(hashes),
        processData: false,
        contentType: false,
      });
    }

    pause(hashes) {
      return this.request("/api/v2/torrents/stop", {
        method: "POST",
        data: createFormData(hashes),
        processData: false,
        contentType: false,
      });
    }

    delete(hashes, deleteFiles = true) {
      return this.request("/api/v2/torrents/delete", {
        method: "POST",
        data: createFormData(hashes, { deleteFiles }),
        processData: false,
        contentType: false,
      });
    }

    sync() {
      return new Promise((resolve, reject) => {
        this.request("/api/v2/sync/maindata")
          .then((data) => {
            if (!data.torrents) {
              console.warn("[QBitTorrent] No torrent data received");
              console.log("[QBitTorrent]", "No torrent data received", "");
              return resolve();
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
            resolve(processed);
          })
          .catch((error) => {
            console.error("[QBitTorrent] Sync failed:", error);
            console.log("[QBitTorrent]", "Sync failed:", error);
            reject(error);
          });
      });
    }

    startAutoSync(interval = 5000) {
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
    console.log("[QBitTorrent]", "Initializing QBitTorrent plugin", "");

    Lampa.Lang.add({
      torrent_resume: {
        ru: "Продолжить скачивание",
        en: "Resume",
        uk: "Продовжити завантаження",
        zh: "继续下载",
      },
      torrent_pause: {
        ru: "Пауза",
        en: "Pause",
        uk: "Пауза",
        zh: "暂停",
      },
      torrent_download: {
        ru: "Начать скачивание",
        en: "Download",
        uk: "Завантажити",
        zh: "开始下载",
      },
      torrent_update_status: {
        ru: "Обновить",
        en: "Update",
        uk: "Обновити",
        zh: "更新",
      },
      torrent_status_stalledUP: {
        ru: "🌱 Раздается",
        en: "🌱 Seeding",
        uk: "🌱 Роздається",
        zh: "🌱 做种中",
      },
      torrent_status_stoppedUP: {
        ru: "✅ Загружено",
        en: "✅ Done",
        uk: "✅ Завантажено",
        zh: "✅ 已完成",
      },
      torrent_status_missingFiles: {
        ru: "⚠️ Файлы отсутствуют",
        en: "⚠️ Missing Files",
        uk: "⚠️ Файли відсутні",
        zh: "⚠️ 文件丢失",
      },
      torrent_status_stoppedDL: {
        ru: "⏹️ Остановлено",
        en: "⏹️ Stopped",
        uk: "⏹️ Зупинено",
        zh: "⏹️ 已停止",
      },
      torrent_status_downloading: {
        ru: "📥 Загружается",
        en: "📥 Downloading",
        uk: "📥 Завантажується",
        zh: "📥 下载中",
      },
      torrent_status_stalledDL: {
        ru: "🕔 Приостановлено",
        en: "🕔 Stalled",
        uk: "🕔 Призупинено",
        zh: "🕔 已暂停",
      },
      torrent_status_checkingDL: {
        ru: "🔍 Проверка файлов",
        en: "🔍 Checking Files",
        uk: "🔍 Перевірка файлів",
        zh: "🔍 检查文件中",
      },
      torrent_status_uploading: {
        ru: "📤 Отдача",
        en: "📤 Uploading",
        uk: "📤 Віддача",
        zh: "📤 上传中",
      },
      torrent_status_metaDL: {
        ru: "📝 Загрузка метаданных",
        en: "📝 Metadata",
        uk: "📝 Завантаження метаданих",
        zh: "📝 元数据",
      },
      torrent_status_queuedUP: {
        ru: "⏳ В очереди",
        en: "⏳ Queued",
        uk: "⏳ У черзі",
        zh: "⏳ 排队中",
      },
    });

    const qbit = new QBitTorrent();

    // Initial sync without explicit login
    qbit
      .sync()
      .then(() => {
        console.log("[QBitTorrent]", "Initial sync complete", "");
        qbit.startAutoSync();
      })
      .catch((error) => {
        console.error("[QBitTorrent]", "Failed to initialize:", error);
        console.log("[QBitTorrent]", "Failed to initialize:", error);
        Lampa.Noty.show("Failed to connect to QBitTorrent");
      });

    // Make instance available globally
    window.qbit = qbit;
    Lampa.QBitTorrent = qbit;
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
  if (!window.qbittorrent_plugin_loaded) {
    Lampa.Manifest.plugins = manifest;
    window.qbittorrent_plugin_loaded = true;
    initializeQBitTorrent();
  }
})();
