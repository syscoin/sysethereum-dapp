const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        path: require.resolve('path-browserify'),
        constants: require.resolve('constants-browserify'),
        fs: false, // Can't polyfill in browser
        os: false,
        vm: false,
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );

      config.module.rules = config.module.rules.filter(rule => {
        if (rule.enforce === 'pre') {
          // if it’s declared via `loader`
          if (rule.loader && rule.loader.includes('source-map-loader')) {
            return false;
          }
          // or if it’s declared via `use: […]`
          if (rule.use && rule.use.some(u =>
            (typeof u === 'string' && u.includes('source-map-loader')) ||
            (u.loader  && u.loader.includes('source-map-loader'))
          )) {
            return false;
          }
        }
        return true;
      });

      return config;
    },
  },
};
