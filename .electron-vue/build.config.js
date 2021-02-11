const path = require('path')

/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
  arch: 'all',
  asar: {
    'unpackDir': '{node_modules/puppeteer/.local-chromium/**/*,node_modules/fs-extra/*,images/*}'
  },
  dir: path.join(__dirname, '../'),
  appVersion:'2.0.0',
  icon: path.join(__dirname, '../build/icons/ico'),
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|dist\/web))|\.gitkeep/,
  out: path.join(__dirname, '../build'),
  overwrite: true,
  win32metadata:{},
  platform: process.env.BUILD_TARGET || 'all'
}