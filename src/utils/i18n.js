import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: loadLocaleMessages()
})

// const loadedLanguages = ['zh']

// function setI18nLanguage (lang) {
//   i18n.locale = lang
//   // axios.defaults.headers.common['Accept-Language'] = lang
//   document.querySelector('html').setAttribute('lang', lang)
//   return lang
// }

// export function loadLanguageAsync (lang) {
//   if (i18n.locale !== lang) {
//     if (!loadedLanguages.includes(lang)) {
//       return import(/* webpackChunkName: "locale-[request]" */ `@/locale/${lang}`).then(msgs => {
//         i18n.setLocaleMessage(lang, msgs.default)
//         loadedLanguages.push(lang)
//         return setI18nLanguage(lang)
//       })
//     }
//     return Promise.resolve(setI18nLanguage(lang))
//   }
//   return Promise.resolve(lang)
// }

// export default new VueI18n({
//   locale: localStorage.getItem('locale') || 'zh',
//   messages: loadLocaleMessages()
// })
