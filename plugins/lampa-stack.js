(function () {
  "use strict";

  console.originalLog = console.log;
  const internalLog = function() {
    let args = Array.from(arguments);
    if (args.length < 3) {
      args.push("");
    }
    console.originalLog.apply(console, args);
  };
  const log = function() {
    let args = Array.from(arguments);
    args.unshift("Lampa Stack");
    internalLog.apply(console, args);
  };

  log("Starting");

  // Wait for Lampa to be available
  var timer = setInterval(function() {
    if (typeof Lampa !== 'undefined') {
      clearInterval(timer);
      log("Lampa detected, initializing");

      const DEFAULT_PLUGINS = [
        {
          url: "https://nb557.github.io/plugins/rating.js",
          status: 1,
          name: "Рейтинг КиноПоиск и IMDB",
          author: "@t_anton",
        },
        // {
        //   url: "/plugins/patched/shikimori.js",
        //   status: 1,
        //   name: "Shikimori catalog",
        //   author: "@lme_chat",
        // },
        // {
        //   // url: "https://skaz.tv/tv.js",
        //   url: "/plugins/patched/tv2.js",
        //   status: 1,
        //   name: "Телевидение by Skaz",
        //   author: "@helpiptv",
        // },
      ];

      const DEFAULT_MENU_SORT = [
        Lampa.Lang.translate("menu_main"),
        Lampa.Lang.translate("menu_feed"),
        Lampa.Lang.translate("settings_input_links"),
        Lampa.Lang.translate("title_subscribes"),
        Lampa.Lang.translate("menu_history"),
        Lampa.Lang.translate("menu_torrents"),
        "DLNA",
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
        // Lampa.Lang.translate("ТВ by skaz"),
        // Lampa.Lang.translate("TV by skaz 2.0"),
      ];

      let DEFAULT_MENU_HIDE = [
        Lampa.Lang.translate("menu_feed"),
        Lampa.Lang.translate("title_persons"),
        Lampa.Lang.translate("menu_relises"),
        // Lampa.Lang.translate("ТВ by skaz"),
      ];

      const DEFAULT_SETTINGS = {
        // Account settings
        account_use: true,  // Disable Cub sync, we're going to use our own backup

        // Misc
        screensaver_type: "cub",  // Apple screensavers are having issues with certificates

        // Torrent settings
        parser_use: true,
        parse_in_search: true,
        vpn_checked_ready: true,

        menu_sort: DEFAULT_MENU_SORT,
        menu_hide: DEFAULT_MENU_HIDE,
      };

      function setSettingIfNotExists(key, value) {
        if (Lampa.Storage.get(key, "") === "") {
          log("Setting default setting: " + key + "=" + value + ", currently set to " + typeof Lampa.Storage.get(key) + "=" + Lampa.Storage.get(key));
          Lampa.Storage.set(key, value);
        }
      }

      function addPluginIfDoesntExist(plugin) {
        var plugins = Lampa.Plugins.get();
        if (!plugins.find(function(p) { return p.url === plugin.url; })) {
          log("Adding plugin:", plugin.name);
          Lampa.Plugins.add(plugin);
          Lampa.Plugins.save();
        }
      }

      function disableUnwantedElements() {
        // Disable ads
        Lampa.Template.add(
          "DisableAds",
          "<style> .ad-server{display: none;} .open--premium{display: none;}</style>"
        );
        $("body").append(Lampa.Template.get("DisableAds", {}, true));

        // Disable Skaz 1.0
        // Lampa.Template.add(
        //   "DisableSkaz10",
        //   "<style> [data-component=\"iptvskaz_n\"]{display: none;} </style>"
        // );
        // $("body").append(Lampa.Template.get("DisableSkaz10", {}, true));
      }

      function initLampaStack() {
        log("Initializing plugins and settings");

        // Add plugins
        var plugins_to_load = [];
        // for (let plugin of DEFAULT_PLUGINS) {
        //   var plugins = Lampa.Plugins.get();
        //   if (!plugins.find(function(p) { return p.url === plugin.url; })) {
        //     addPluginIfDoesntExist(plugin);
        //     plugins_to_load.push(plugin.url);
        //   }
        // }

        // Load new plugins
        // if (plugins_to_load.length) {
        //   log("Loading new plugins:", plugins_to_load);
        //   Lampa.Utils.putScript(plugins_to_load, function() {
        //     log("Plugins loaded successfully");
        //   }, function() {
        //     log("Error loading some plugins");
        //   }, function() {}, true);
        // }

        // Apply settings
        for (let key in DEFAULT_SETTINGS) {
          setSettingIfNotExists(key, DEFAULT_SETTINGS[key]);
        }

        disableUnwantedElements();

        log("Initialization complete");
      }

      initLampaStack();
    }
  }, 200);
})();

