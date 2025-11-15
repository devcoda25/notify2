// config-overrides.js
const path = require('path');
const webpack = require('webpack');

module.exports = function override(config) {
  // --- force browser builds for lib0 (avoid node:crypto) ---
  const lib0Dist = p => path.resolve(__dirname, 'node_modules/lib0/dist', p);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),

    // Anything that tries to reach the Node entries → browser builds
    'lib0/hash/sha256.node.js': lib0Dist('sha256.cjs'),
    'lib0/dist/sha256.node.cjs': lib0Dist('sha256.cjs'),
    'lib0/webcrypto.node.js':    lib0Dist('webcrypto.cjs'),
    'lib0/dist/webcrypto.node.cjs': lib0Dist('webcrypto.cjs'),

    // Defensive: if someone imports the node: scheme directly
    'node:crypto': require.resolve('crypto-browserify')
  };

  // If you still see missing Node core modules, keep these fallbacks:
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser')
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process']
    })
  ]);

  return config;
};
