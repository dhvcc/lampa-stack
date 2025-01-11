(function () {
  "use strict";

  const DEFAULT_PLUGINS = [
    {
      url: "https://nb557.github.io/plugins/rating.js",
      status: 1,
      name: "Рейтинг КиноПоиск и IMDB",
      author: "@t_anton",
    },
    {
      url: "https://cub.red/plugin/collections",
      status: 1,
      name: "Коллекции CUB",
      author: "@lampa",
      language: "ru",
    },
    {
      url: "http://cub.red/plugin/interface",
      status: 1,
      name: "Стильный интерфейс",
      author: "@lampa",
    },
    {
      url: "http://lampaplugins.github.io/store/o.js",
      status: 1,
      name: "Отзывы и рецензии",
      author: "@elenatv99",
      language: "ru",
    },
    // {
    //   url: "/plugins/lampac-online.js",
    //   status: 1,
    //   name: "Lampac Online",
    //   author: "@immisterio",
    // },
    // {
    //   url: "https://showy.online/m.js",
    //   status: 1,
    //   name: "Showy Free",
    //   author: "@showybot",
    // },
    // {
    //   url: "https://showypro.com/m.js",
    //   status: 1,
    //   name: "Showy Pro [RU]",
    //   author: "@showybot",
    // },
    // {
    //   url: "http://showy.pro/m.js",
    //   status: 1,
    //   name: "Showy Pro [EU]",
    //   author: "@showybot",
    // },
    {
      // Is it safe?
      url: "https://lampame.github.io/main/shikimori.js",
      status: 1,
      name: "Shikimori catalog",
      author: "@lme_chat",
    },
    {
      url: "http://skaz.tv/tv.js",
      status: 1,
      name: "Телевидение by Skaz ",
      author: "@helpiptv",
      // Enabled it for every language since it's a very good plugin, sadly without translations
      // language: "ru", 
    },
  ];

  const DEFAULT_SETTINGS = {};

  const plugins = Lampa.Plugins.get();
  const language = Lampa.Storage.get("language");
  function addPluginIfDoesntExist(plugin) {
    if (!plugins.some((p) => p.url === plugin.url)) {
      console.log("[Dhvcc defaults]", "Adding plugin: ", plugin.name);
      if (plugin.language && plugin.language !== language) {
        console.log("[Dhvcc defaults]", "Skipping plugin: ", plugin.name, " because it's not for language: ", language);
        return;
      }
      Lampa.Utils.putScriptAsync([plugin.url], false, null, () => {
        let plugins = Lampa.Storage.get('plugins', '[]');
        plugins.push(plugin);
        Lampa.Storage.set('plugins', plugins);
      }, false);
    }
  }

  function init() {
    console.log("[Dhvcc defaults]", "Init, setting default settings", '');

    // Set default settings
    for (let key in DEFAULT_SETTINGS) {
      Lampa.Storage.set(key, DEFAULT_SETTINGS[key]);
    }

    // Initialize default plugins if none exist
    for (let plugin of DEFAULT_PLUGINS) {
      addPluginIfDoesntExist(plugin);
    }

    const menu_hide_value = Lampa.Storage.get("menu_hide", []);
    if (!menu_hide_value || menu_hide_value.length === 0) {
      console.warn("[Dhvcc defaults] No menu items hidden. Setting default menu items.");
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
        Lampa.Lang.translate("menu_collections"),
        Lampa.Lang.translate("menu_filter"),
        Lampa.Lang.translate("menu_anime"),
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
      if (language !== "ru") {  // TODO: Find a better way to do this. Collections is somehow embeded in the menu
        DEFAULT_MENU_HIDE.push(Lampa.Lang.translate("menu_collections"));
      }
      Lampa.Storage.set("menu_hide", DEFAULT_MENU_HIDE);
      Lampa.Storage.set("menu_sort", DEFAULT_MENU_SORT);
    }

    // Disable Christmas
    Lampa.Template.add(
      "DisableChristmas",
      "<style> .christmas__button{display: none;} .head__logo-cap {display: none;} </style>"
    );
    $("body").append(Lampa.Template.get("DisableChristmas", {}, true));
  }

  // Plugin manifest
  const manifest = {
    name: "Dhvcc's defaults",
    version: "1.0.0",
    description: "Dhvcc's defaults plugin",
    author: "@dhvcc",
    type: "setup",
    init: init,
  };

  // Register plugin
  Lampa.Manifest.plugins = manifest;

  if (!window.dhvcc_defaults_loaded) {
    init();
    window.dhvcc_defaults_loaded = true;
  }
})();
