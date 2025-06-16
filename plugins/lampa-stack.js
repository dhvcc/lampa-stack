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

      const DEFAULT_MENU_SORT = [
        Lampa.Lang.translate("menu_main"),
        Lampa.Lang.translate("menu_feed"),
        Lampa.Lang.translate("settings_input_links"),
        Lampa.Lang.translate("title_subscribes"),
        Lampa.Lang.translate("menu_history"),
        Lampa.Lang.translate("menu_torrents"),
        "Скачанные торренты",
        Lampa.Lang.translate("menu_timeline"),
        Lampa.Lang.translate("menu_movies"),
        Lampa.Lang.translate("title_persons"),
        Lampa.Lang.translate("menu_tv"),
        Lampa.Lang.translate("menu_anime"),
        Lampa.Lang.translate("menu_catalog"),
        Lampa.Lang.translate("menu_relises"),
        "Коллекции",
        Lampa.Lang.translate("menu_filter"),
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

        // Torrent settings
        parser_use: true,
        parse_in_search: true,
        vpn_checked_ready: true,

        // Misc
        screensaver_type: "cub",  // Apple screensavers are having issues with certificates
        cub_screensaver: "https://cub.red/extensions/202",
        menu_sort: DEFAULT_MENU_SORT,
        menu_hide: DEFAULT_MENU_HIDE,
      };

      function setSettingIfNotExists(key, value) {
        if (Lampa.Storage.get(key, "") === "") {
          log("Setting default setting: " + key + "=" + value + ", currently set to " + typeof Lampa.Storage.get(key) + "=" + Lampa.Storage.get(key));
          Lampa.Storage.set(key, value);
        }
      }

      function disableUnwantedElements() {
        // Disable ads
        Lampa.Template.add(
          "DisableAds",
          '<style> .ad-server{display: none;} .open--premium{display: none;} .notice:has(.notice__img img[src="https://cub.red/img/icons/premium_two.svg"]){display: none;} </style>'
        );
        $("body").append(Lampa.Template.get("DisableAds", {}, true));

        Lampa.Template.add(
          "Hide useless elements",
          "<style> .head__action.selector.open--profile{display: none;} </style>"
        );
        $("body").append(Lampa.Template.get("Hide useless elements", {}, true));

        Lampa.Template.add(
          "Hide Info menu item",
          "<style> #app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div.menu__case.nosort > ul > li:nth-child(2){display: none;} </style>"
        );
        $("body").append(Lampa.Template.get("Hide Info menu item", {}, true));

        Lampa.Template.add(
          "Hide Settings menu item",
          "<style> #app > div.wrap.layer--height.layer--width > div.wrap__left.layer--height > div > div > div > div > div.menu__case.nosort > ul > li:nth-child(1){display: none;} </style>"
        );
        $("body").append(Lampa.Template.get("Hide Settings menu item", {}, true));

         Lampa.Template.add(
          "Hide some settings",
          "<style> .selector[data-component=\"parental_control\"]{display: none;} .selector[data-component=\"tmdb\"]{display: none;} </style>"
        );
        $("body").append(Lampa.Template.get("Hide some settings", {}, true));

        // Disable Skaz 1.0
        // Lampa.Template.add(
        //   "DisableSkaz10",
        //   "<style> [data-component=\"iptvskaz_n\"]{display: none;} </style>"
        // );
        // $("body").append(Lampa.Template.get("DisableSkaz10", {}, true));
      }

      function addCustomElements() {
        setTimeout(function() {
          var m_reload = '<div id="MRELOAD" class="head__action selector m-reload-screen"><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.4800000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" fill="currentColor"></path></g></svg></div>';
          $('body').find('.head__actions').append(m_reload);
          $('body').find('.head__actions #RELOAD').remove();
  
          $('#MRELOAD').on('hover:enter hover:click hover:touch', function() {
            location.reload();
          });
        }, 2000);
      }

      function initLampaStack() {
        log("Initializing plugins and settings");

        // Apply settings
        for (let key in DEFAULT_SETTINGS) {
          setSettingIfNotExists(key, DEFAULT_SETTINGS[key]);
        }

        disableUnwantedElements();
        addCustomElements();
        log("Initialization complete");
      }

      initLampaStack();
    }
  }, 200);
})();

