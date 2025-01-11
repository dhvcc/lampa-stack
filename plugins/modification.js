(function () {
  "use strict";

  console.log("[Lampa stack modification]", "Running lampa modification", "");

  const plugins = Lampa.Plugins.get();
  function addPluginIfDoesntExist(plugin) {
    if (!plugins.some((p) => p.url === plugin.url)) {
      console.log("[Lampa stack modification]", "Adding plugin:", plugin.name);
      Lampa.Plugins.add(plugin);
    }
  }

  addPluginIfDoesntExist({
    url: "/plugins/dhvcc-defaults.js",
    status: 1,
    name: "Dhvcc's defaults",
    author: "@dhvcc",
  });

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
})();
