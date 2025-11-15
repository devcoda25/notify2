// client/postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

console.log('Using PostCSS config:', __filename);
