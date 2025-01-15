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
      url: "/plugins/pubtorr.patched.js",
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
      url: "/plugins/lampac-online.js",
      status: 1,
      name: "Lampac Online",
      author: "@immisterio",
    },
  ];

  const DEFAULT_SETTINGS = {
    parser_use: true,
    vpn_checked_ready: true,
    torrserver_url: window.location.origin + "/torrserver",
    jackett_url: `${window.location.origin.toString().replace('http://', '').replace('https://', '')}/jackett`,
    jackett_key: "r690g47kuxnje7m1elrlbo1bs72u7b16",
    jackett_url2: "http://jacred.xyz",
    jackett_key2: '',
    jackett_url3: "http://redapi.cfhttp.top",
    jackett_key3: "1",

    // Local Jackett. Should be by default? I guess we need an updated startup page for that
    // jackett_key: "r690g47kuxnje7m1elrlbo1bs72u7b16",
    // jackett_url: `${window.location.origin.toString().replace('http://', '').replace('https://', '')}/jackett`,

    // Jacred
    // jackett_url: "jacred.xyz",
    // jackett_url2: "jacred_xyz",
    // lme_url_two: "jacred_xyz",

    // From lampac
    // jackett_key: "1",
    // jackett_url: "redapi.cfhttp.top",
    // parser_torrent_type: "jackett",

    parse_in_search: true,
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
