(function () {
  "use strict";

  console.log("Lampa Stack", "Starting", "");
  Lampa.Stack = {};

  function log() {
    const args = Array.from(arguments);
    const prefix = "Lampa Stack";
    
    // Ensure at least 2 additional arguments after prefix
    while (args.length < 2) {
      args.push("");
    }

    // Call console.log with prefix and all arguments
    console.log(prefix, ...args);
  }

  Lampa.Stack.log = log;


  const DEFAULT_PLUGINS = [
    // Core functionality plugins
    {
      url: "/plugins/sync.js",
      status: 1,
      name: "Sync",
      author: "",
    },
    {
      url: "/plugins/qbittorrent.js",
      status: 1,
      name: "QBitTorrent",
      author: "",
    },
    {
      url: "http://cub.red/plugin/tmdb-proxy",
      status: 1,
      name: "TMDB Proxy",
      author: "@lampa",
    },
    {
      url: "https://plugin.rootu.top/ts-preload.js",
      status: 1,
      name: "Предзагрузка ts",
      author: "@rootu",
    },
    // Content source plugins
    {
      url: "https://nb557.github.io/plugins/rating.js",
      status: 1,
      name: "Рейтинг КиноПоиск и IMDB",
      author: "@t_anton",
    },
    // Bad defaults (no proxy mostly), disable for now
    // {
    //   url: "https://nb557.github.io/plugins/online_mod.js",
    //   status: 1,
    //   name: "Online mod",
    //   author: "@nb557",
    // },
    {
      url: "/plugins/patched/pubtorr.js",
      status: 1,
      name: "Публичные парсеры",
      author: "@lme_chat",
    },
    {
      url: "/plugins/patched/lampac-online.js",
      status: 1,
      name: "Lampac Online",
      author: "@immisterio",
    },
    {
      url: "/plugins/patched/shikimori.js",
      status: 1,
      name: "Shikimori catalog",
      author: "@lme_chat",
    },
    // UI and collections
    {
      url: "http://cub.red/plugin/interface",
      status: 1,
      name: "Стильный интерфейс",
      author: "@lampa",
    },
    {
      url: "http://skaz.tv/tv.js",
      status: 1,
      name: "Телевидение by Skaz",
      author: "@helpiptv",
    },
    {
      url: "http://cub.red/plugin/etor",
      status: 1,
      name: 'Добавляет пункт "Парсер" в меню',
      author: "@lampa",
    },
    // Store
    {
      url: "http://lampaplugins.github.io/store/store.js",
      status: 1,
      name: "Пиратские плагины",
    },
  ];

  const DEFAULT_SETTINGS = {
    // Account settings
    account_use: false,  // Disable Cub sync, we're going to use our own backup

    // Torrent settings
    parser_use: true,
    parse_in_search: true,
    vpn_checked_ready: true,
    torrserver_url: window.location.origin + "/torrserver",
    torrserver_auth: false,
    jackett_url: "http://jacred.xyz",
    jackett_key: '',
    jackett_url2: "http://redapi.cfhttp.top",
    jackett_key2: "1",
  };

  function setSettingIfNotExists(key, value) {
    if (Lampa.Storage.get(key, "") === "") {
      Lampa.Stack.log(
        "Setting default setting: " + key + "=" + value + ", currently set to " + typeof Lampa.Storage.get(key) + "=" + Lampa.Storage.get(key)
      );
      Lampa.Storage.set(key, value);
    }
  }

  function addPluginIfDoesntExist(plugin) {
    if (!Lampa.Storage.get("plugins", "[]").some((p) => p.url === plugin.url)) {
      Lampa.Stack.log("Adding plugin:", plugin.name);

      // Skip language-specific plugins if they don't match current language
      if (plugin.language && plugin.language !== Lampa.Storage.get("language")) {
        Lampa.Stack.log("Skipping plugin due to language mismatch:", plugin.name);
        return;
      }

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

  function setupDefaultMenu() {
    const menu_hide_value = Lampa.Storage.get("menu_hide", []);
    if (!menu_hide_value || menu_hide_value.length === 0) {
      Lampa.Stack.log("Setting up default menu configuration");

      const DEFAULT_MENU_SORT = [
        Lampa.Lang.translate("menu_main"),
        Lampa.Lang.translate("menu_feed"),
        Lampa.Lang.translate("settings_input_links"),
        Lampa.Lang.translate("title_subscribes"),
        Lampa.Lang.translate("menu_history"),
        Lampa.Lang.translate("menu_torrents"),
        Lampa.Lang.translate("menu_timeline"),
        Lampa.Lang.translate("menu_movies"),
        Lampa.Lang.translate("title_persons"),
        Lampa.Lang.translate("menu_tv"),
        Lampa.Lang.translate("menu_catalog"),
        Lampa.Lang.translate("menu_relises"),
        "Коллекции",
        Lampa.Lang.translate("menu_filter"),
        Lampa.Lang.translate("menu_anime"),
        "Shikimori icon\n            \n            Shikimori",
        Lampa.Lang.translate("Shikimori"),
        Lampa.Lang.translate("ТВ by skaz"),
        Lampa.Lang.translate("TV by skaz 2.0"),
      ];

      let DEFAULT_MENU_HIDE = [
        Lampa.Lang.translate("menu_feed"),
        Lampa.Lang.translate("title_persons"),
        Lampa.Lang.translate("menu_relises"),
        Lampa.Lang.translate("ТВ by skaz"),
      ];

      const language = Lampa.Storage.get("language");
      if (language !== "ru") {
        DEFAULT_MENU_HIDE.push(Lampa.Lang.translate("menu_collections"));
      }

      Lampa.Storage.set("menu_hide", DEFAULT_MENU_HIDE);
      Lampa.Storage.set("menu_sort", DEFAULT_MENU_SORT);
    }
  }

  function disableUnwantedElements() {
    // Disable Christmas decorations
    Lampa.Template.add(
      "DisableChristmas",
      "<style> .christmas__button{display: none;} .head__logo-cap {display: none;} </style>"
    );
    $("body").append(Lampa.Template.get("DisableChristmas", {}, true));

    // Disable ads
    Lampa.Template.add(
      "DisableAds",
      "<style> .ad-server{display: none;} </style>"
    );
    $("body").append(Lampa.Template.get("DisableAds", {}, true));

    // Disable Skaz 1.0
    Lampa.Template.add(
      "DisableSkaz10",
      "<style> [data-component=\"iptvskaz_n\"]{display: none;} </style>"
    );
    $("body").append(Lampa.Template.get("DisableSkaz10", {}, true));
  }

  function init() {
    Lampa.Stack.log("Initializing stack");

    for (let plugin of DEFAULT_PLUGINS) {
      addPluginIfDoesntExist(plugin);
    }

    for (let key in DEFAULT_SETTINGS) {
      setSettingIfNotExists(key, DEFAULT_SETTINGS[key]);
    }

    setupDefaultMenu();

    disableUnwantedElements();

    Lampa.Lang.add({
    });
  }

  // Plugin manifest
  const manifest = {
    name: "Lampa Stack",
    version: "1.0.0",
    description: "Lampa Stack",
    author: "",
    type: "setup",
    init,
  };
  Lampa.Stack.manifest = manifest;

  // Register plugin
  Lampa.Manifest.plugins = manifest;

  if (!window.lampa_stack_loaded) {
    init();
    window.lampa_stack_loaded = true;
  }
})();

