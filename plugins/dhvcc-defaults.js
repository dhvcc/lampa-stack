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
    },
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
    },
  ];

  const DEFAULT_SETTINGS = {};

  const plugins = Lampa.Plugins.get();
  function addPluginIfDoesntExist(plugin) {
    if (!plugins.some((p) => p.url === plugin.url)) {
      console.info(`[Dhvcc defaults] Adding plugin: ${plugin.name}`);
      Lampa.Plugins.add(plugin);
    }
  }

  function init() {
    console.info("[Dhvcc defaults] Init, setting default settings");

    // Set default settings
    for (let key in DEFAULT_SETTINGS) {
      Lampa.Storage.set(key, DEFAULT_SETTINGS[key]);
    }

    // Initialize default plugins if none exist
    for (let plugin of DEFAULT_PLUGINS) {
      addPluginIfDoesntExist(plugin);
    }

    // Disable Christmas button
    Lampa.Template.add(
      "DisableChristmasButton",
      "<style> .christmas__button{display: none;} </style>"
    );
    $("body").append(Lampa.Template.get("DisableChristmasButton", {}, true));
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
})();
