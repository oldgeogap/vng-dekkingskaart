const withTM = require("next-transpile-modules")(["dexie"]);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
      config.node = {
        __dirname: true
      };
    }

    return config;
  }
});
