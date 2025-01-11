(function () {
  "use strict";

  console.log("[Lampa stack modification]", "Running lampa modification", "");

//   const currentPlugins = Lampa.Storage.get("plugins", []);
//   console.log("[Lampa stack modification]", "Current plugins", currentPlugins);

// //   Load previous plugins
//   currentPlugins.forEach((plugin) => {
//     addPluginIfDoesntExist(plugin);
//   });

//   console.log(
//     "[Lampa stack modification]",
//     "Loaded previous plugins",
//     Lampa.Plugins.get()
//   );

  function addPluginIfDoesntExist(plugin) {
    if (!Lampa.Storage.get("plugins", "[]").some((p) => p.url === plugin.url)) {
      console.log("[Lampa stack modification]", "Adding plugin:", plugin.name);
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

  addPluginIfDoesntExist({
    url: "/plugins/lampa-stack-defaults.js",
    status: 1,
    name: "Lampa stack defaults",
    author: "@dhvcc",
  });

  addPluginIfDoesntExist({
    url: "/plugins/qbittorrent.js",
    status: 1,
    name: "QBitTorrent",
    author: "@dhvcc",
  });

  addPluginIfDoesntExist({
    url: "/plugins/dhvcc-defaults.js",
    status: 1,
    name: "Dhvcc's defaults",
    author: "@dhvcc",
  });
})();
