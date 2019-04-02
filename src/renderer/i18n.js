import Vue from 'vue'
import VueI18n from 'vue-i18n'
const path = require('path')
Vue.use(VueI18n)

function loadLocaleMessages () {
  // const locales = require.context(path.join(__dirname,'locales'), true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const en = require('./locales/en.json')
  const ar = require('./locales/ar.json')
  const fr = require('./locales/fr.json')

  const messages = {
    'en': en,
    'ar': ar,
    'fr': fr
  }
  // locales.keys().forEach(key => {
  //   const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  //   if (matched && matched.length > 1) {
  //     const locale = matched[1]
  //     messages[locale] = locales(key)
  //   }
  // })
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'ar',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ar',
  messages: loadLocaleMessages()
})
