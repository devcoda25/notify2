// config-overrides.js
const path = require('path');
const webpack = require('webpack');

module.exports = function override(config) {
  // --- your existing code (aliases, fallbacks, ProvidePlugin) ---
  const lib0Dist = p => path.resolve(__dirname, 'node_modules/lib0/dist', p);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'lib0/hash/sha256.node.js': lib0Dist('sha256.cjs'),
    'lib0/dist/sha256.node.cjs': lib0Dist('sha256.cjs'),
    'lib0/webcrypto.node.js':    lib0Dist('webcrypto.cjs'),
    'lib0/dist/webcrypto.node.cjs': lib0Dist('webcrypto.cjs'),
    'node:crypto': require.resolve('crypto-browserify')
  };

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

  // --- FORCE postcss-loader to use Tailwind v4 plugin ---
  const rules = config.module.rules.find(r => Array.isArray(r.oneOf))?.oneOf || [];
  for (const rule of rules) {
    const uses = Array.isArray(rule.use) ? rule.use : (rule.use ? [rule.use] : []);
    for (const use of uses) {
      if (use && use.loader && use.loader.includes('postcss-loader')) {
        use.options = use.options || {};
        use.options.postcssOptions = use.options.postcssOptions || {};
        // Hard-set plugins so no external config can inject the old plugin
        use.options.postcssOptions.plugins = [
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
        ];
      }
    }
  }
  // --- end force ---

  return config;
};
