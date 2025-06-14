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

      function setupHttpsInterception() {
        log("Setting up comprehensive HTTPS interception");
        
        // Get current domain for proxy
        const proxyBase = window.location.protocol + "//" + window.location.host + "/proxy?url=";
        
        function makeSecure(url) {
          if (typeof url === 'string' && url.startsWith('http://')) {
            log("Proxying HTTP URL:", url);
            return proxyBase + encodeURIComponent(url);
          }
          return url;
        }

        // 1. Intercept fetch
        if (window.fetch && !window.fetch._lampaPatched) {
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            return originalFetch(makeSecure(url), options);
          };
          window.fetch._lampaPatched = true;
          log("Patched fetch()");
        }

        // 2. Intercept XMLHttpRequest
        if (window.XMLHttpRequest && !XMLHttpRequest.prototype.open._lampaPatched) {
          const originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            return originalOpen.call(this, method, makeSecure(url), async, user, password);
          };
          XMLHttpRequest.prototype.open._lampaPatched = true;
          log("Patched XMLHttpRequest");
        }

        // 3. Intercept video element src
        if (window.HTMLVideoElement && !HTMLVideoElement.prototype.setAttribute._lampaPatched) {
          const originalVideoSetAttribute = HTMLVideoElement.prototype.setAttribute;
          HTMLVideoElement.prototype.setAttribute = function(name, value) {
            if (name === 'src' || name === 'data-src') {
              value = makeSecure(value);
            }
            return originalVideoSetAttribute.call(this, name, value);
          };
          HTMLVideoElement.prototype.setAttribute._lampaPatched = true;

          // Also patch the src property directly
          const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'src') || 
                                       Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
          if (originalSrcDescriptor && originalSrcDescriptor.set && !originalSrcDescriptor.set._lampaPatched) {
            Object.defineProperty(HTMLVideoElement.prototype, 'src', {
              set: function(value) {
                originalSrcDescriptor.set.call(this, makeSecure(value));
              },
              get: originalSrcDescriptor.get,
              configurable: true
            });
            originalSrcDescriptor.set._lampaPatched = true;
          }
          log("Patched HTMLVideoElement");
        }

        // 4. Intercept audio element src
        if (window.HTMLAudioElement && !HTMLAudioElement.prototype.setAttribute._lampaPatched) {
          const originalAudioSetAttribute = HTMLAudioElement.prototype.setAttribute;
          HTMLAudioElement.prototype.setAttribute = function(name, value) {
            if (name === 'src' || name === 'data-src') {
              value = makeSecure(value);
            }
            return originalAudioSetAttribute.call(this, name, value);
          };
          HTMLAudioElement.prototype.setAttribute._lampaPatched = true;
          log("Patched HTMLAudioElement");
        }

        // 5. Watch for HLS.js and other video libraries
        function patchHlsJs() {
          if (window.Hls && !window.Hls._lampaPatched) {
            const originalLoadSource = window.Hls.prototype.loadSource;
            window.Hls.prototype.loadSource = function(url) {
              log("HLS.js loading source:", url);
              return originalLoadSource.call(this, makeSecure(url));
            };
            window.Hls._lampaPatched = true;
            log("Patched HLS.js");
          }
        }

        // 6. Watch for dynamically added elements
        function setupMutationObserver() {
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                  // Check for video/audio elements with HTTP sources
                  const mediaElements = node.querySelectorAll ? 
                    node.querySelectorAll('video[src^="http://"], audio[src^="http://"], source[src^="http://"]') : [];
                  
                  for (let i = 0; i < mediaElements.length; i++) {
                    const el = mediaElements[i];
                    const src = el.getAttribute('src');
                    if (src && src.startsWith('http://')) {
                      log("Found HTTP media element, proxying:", src);
                      el.setAttribute('src', makeSecure(src));
                    }
                  }
                  
                  // Check if the node itself is a media element
                  if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO' || node.tagName === 'SOURCE') {
                    const src = node.getAttribute('src');
                    if (src && src.startsWith('http://')) {
                      log("Found HTTP media node, proxying:", src);
                      node.setAttribute('src', makeSecure(src));
                    }
                  }
                }
              });
            });
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          log("MutationObserver active");
        }

        // 7. Patch URL constructor for completeness
        if (window.URL && !window.URL._lampaPatched) {
          const originalURL = window.URL;
          window.URL = function(url, base) {
            if (typeof url === 'string' && url.startsWith('http://')) {
              url = makeSecure(url);
            }
            return new originalURL(url, base);
          };
          // Copy static methods
          Object.setPrototypeOf(window.URL, originalURL);
          Object.getOwnPropertyNames(originalURL).forEach(function(name) {
            if (typeof originalURL[name] === 'function') {
              window.URL[name] = originalURL[name];
            }
          });
          window.URL._lampaPatched = true;
          log("Patched URL constructor");
        }

        // Initialize everything
        patchHlsJs();
        setupMutationObserver();
        
        // Re-check for HLS.js periodically (in case it loads later)
        setTimeout(patchHlsJs, 1000);
        setTimeout(patchHlsJs, 5000);
        
        log("HTTPS interception setup complete");
      }

      function initLampaStack() {
        log("Initializing plugins and settings");

        // Add plugins
        var plugins_to_load = [];
        for (let plugin of DEFAULT_PLUGINS) {
          var plugins = Lampa.Plugins.get();
          if (!plugins.find(function(p) { return p.url === plugin.url; })) {
            addPluginIfDoesntExist(plugin);
            plugins_to_load.push(plugin.url);
          }
        }

        // Load new plugins
        if (plugins_to_load.length) {
          log("Loading new plugins:", plugins_to_load);
          Lampa.Utils.putScript(plugins_to_load, function() {
            log("Plugins loaded successfully");
          }, function() {
            log("Error loading some plugins");
          }, function() {}, true);
        }

        // Apply settings
        for (let key in DEFAULT_SETTINGS) {
          setSettingIfNotExists(key, DEFAULT_SETTINGS[key]);
        }

        disableUnwantedElements();
        setupHttpsInterception();

        log("Initialization complete");
      }

      initLampaStack();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/plugins/sw.js');
      }
    }
  }, 200);
})();

