const postcss = require('postcss-rtl')
const autoprefix = require('autoprefixer')

module.exports = {
  plugins: [
    postcss,
    autoprefix,
  ],
}