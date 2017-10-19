const soEditor = require('./editor/editor.vue')

module.exports = {
  install: (Vue) => {
    Vue.component('so-editor', soEditor)
  }
}
