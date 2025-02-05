(function () {
  "use strict";

  console.log("[Lampa stack defaults]", "Initializing", "");

  const DEFAULT_PLUGINS = [
    {
      url: "http://lampaplugins.github.io/store/o.js",
      status: 1,
      name: "Отзывы и рецензии",
      author: "@elenatv99",
    },
    {
      url: "http://lampaplugins.github.io/store/store.js",
      status: 1,
      name: "Пиратские плагины",
    },
    {
      url: "https://nb557.github.io/plugins/online_mod.js",
      status: 1,
      name: "Online mod",
      author: "@nb557",
    },
    {
      url: "http://cub.red/plugin/tmdb-proxy",
      status: 1,
      name: "TMDB Proxy",
      author: "@lampa",
    },
    {
      // url: "https://lampame.github.io/main/pubtorr.js",
      url: "/plugins/patched.pubtorr.js",
      status: 1,
      name: "Публичные парсеры",
      author: "@lme_chat",
    },
    {
      url: "http://cub.red/plugin/etor",
      status: 1,
      name: 'Добавляет пункт "Парсер" в меню',
      author: "@lampa",
    },
    {
      url: "https://plugin.rootu.top/ts-preload.js",
      status: 1,
      name: "Предзагрузка ts",
      author: "@rootu",
    },
    {
      url: "/plugins/patched.lampac-online.js",
      status: 1,
      name: "Lampac Online",
      author: "@immisterio",
    },
  ];

  const DEFAULT_SETTINGS = {
    parser_use: true,
    parse_in_search: true,
    vpn_checked_ready: true,
    torrserver_url: window.location.origin + "/torrserver",
    torrserver_auth: true,
    torrserver_login: "admin",
    torrserver_password: "",
    qbittorrent_user: "admin",
    qbittorrent_password: "",
    jackett_url: `${window.location.origin.toString().replace('http://', '').replace('https://', '')}/jackett`,
    // FIXME: CHANGE
    jackett_key: "r690g47kuxnje7m1elrlbo1bs72u7b16",
    //
    jackett_url2: "http://jacred.xyz",
    jackett_key2: '',
    jackett_url3: "http://redapi.cfhttp.top",
    jackett_key3: "1",
  };
  function setSettingIfNotExists(key, value) {
    if (Lampa.Storage.get(key, "") === "") {
      console.log(
        "[Lampa stack]",
        "Setting default setting:",
        key,
        "=",
        value,
        ", currently set to",
        typeof Lampa.Storage.get(key),
        Lampa.Storage.get(key)
      );
      Lampa.Storage.set(key, value);
    }
  }

  function addPluginIfDoesntExist(plugin) {
    if (!Lampa.Storage.get("plugins", "[]").some((p) => p.url === plugin.url)) {
      console.log("[Lampa stack]", "Adding plugin:", plugin.name);
      Lampa.Utils.putScriptAsync(
        [plugin.url],
        false,
        null,
        () => {
          let plugins = Lampa.Storage.get("plugins", "[]");
          plugins.push(plugin);
          Lampa.Storage.set("plugins", plugins);
        },
        false
      );
    }
  }

  function initializeStack() {
    console.log("[Lampa stack]", "Init, setting default settings", "");

    // Set default settings
    for (let key in DEFAULT_SETTINGS) {
      setSettingIfNotExists(key, DEFAULT_SETTINGS[key]);
    }

    // Initialize default plugins if none exist
    for (let plugin of DEFAULT_PLUGINS) {
      addPluginIfDoesntExist(plugin);
    }

    Lampa.Lang.add({
      settings_main_torrserver: {
        ru: "Торренты",
        en: "Torrents",
        uk: "Торренти",
        zh: "种子",
      },
      settings_server_links: {
        ru: "TorrServer",
        en: "TorrServer",
        uk: "TorrServer",
        zh: "TorrServer",
      },
      settings_qbittorrent_credentials: {
        ru: "qBittorrent",
        en: "qBittorrent",
        uk: "qBittorrent",
        zh: "qBittorrent",
      },
      settings_parser_qbittorrent_user_placeholder: {
        ru: "",
        en: "",
        uk: "",
        zh: "",
      },
      settings_parser_qbittorrent_password_placeholder: {
        ru: "",
        en: "",
        uk: "",
        zh: "",
      },
      settings_qbittorrent_user: {
        ru: "Логин qBittorrent",
        en: "qBittorrent login",
        uk: "Логін qBittorrent",
        zh: "qBittorrent 登录",
      },
      settings_qbittorrent_user_descr: {
        ru: "Логин для qBittorrent",
        en: "Login for qBittorrent",
        uk: "Логін для qBittorrent",
        zh: "qBittorrent 登录",
      },
      settings_qbittorrent_password: {
        ru: "Пароль qBittorrent",
        en: "qBittorrent password",
        uk: "Пароль qBittorrent",
        zh: "qBittorrent 密码",
      },
      settings_qbittorrent_password_descr: {
        ru: "Пароль для qBittorrent",
        en: "Password for qBittorrent",
        uk: "Пароль для qBittorrent",
        zh: "qBittorrent 密码",
      },
    })
  }

  // Plugin manifest
  const manifest = {
    name: "Lampa Stack Defaults",
    version: "1.0.0",
    description: "Lampa stack defaults plugin",
    author: "@dhvcc",
    type: "setup",
    init: initializeStack,
  };

  // Register plugin
  Lampa.Manifest.plugins = manifest;

  if (!window.lampa_stack_defaults_loaded) {
    initializeStack();
    window.lampa_stack_defaults_loaded = true;
  }
})();
