(function () {
  "use strict";

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
      url: "http://cub.red/plugin/tmdb-proxy",
      status: 1,
      name: "TMDB Proxy",
      author: "@lampa",
    },
    {
      url: "https://lampame.github.io/main/pubtorr.js",
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
  ];

  const DEFAULT_SETTINGS = {
    parser_use: true,
    vpn_checked_ready: true,
    torrserver_url: window.location.origin + "/torrserver",
    jackett_key: "",
    jackett_url: "jacred.xyz",
    jackett_url2: "jacred_xyz",
    lme_url_two: "jacred_xyz",
    parse_in_search: true,
  };

  const plugins = Lampa.Plugins.get();
  function addPluginIfDoesntExist(plugin) {
    if (!plugins.some((p) => p.url === plugin.url)) {
      console.info(`[LAMPA STACK] Adding plugin: ${plugin.name}`);
      Lampa.Plugins.add(plugin);
    }
  }

  function initializeStack() {
    console.info("[LAMPA STACK] Init, setting default settings");

    // Set default settings
    for (let key in DEFAULT_SETTINGS) {
      Lampa.Storage.set(key, DEFAULT_SETTINGS[key]);
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
  window.lampa_stack = true;
  Lampa.Manifest.plugins = manifest;
})();
