
// postcss-loader exposes Context (ctx) to the config file, making postcss.config.js dynamic

module.exports = ({ file }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {},
    'autoprefixer': {},
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
})
