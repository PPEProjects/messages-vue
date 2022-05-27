import Vue from 'vue'

const setting =  (Vue) => {
  Vue.prototype.$focusInbox = {

    show: ($el, onRecall = () => {}) => {

      const react = $el.getBoundingClientRect()

      const _clone = $el.cloneNode(true)
      /**
       * get with, height, offset => clone to body => new vue
       */

      const $div = document.createElement('div')
      $div.classList.add('fixed')
      $div.style.width = react.width + 'px'
      $div.style.left = react.left + 'px'
      $div.style.top = ((window.innerHeight / 3) - 50) + 'px'


      Vue.prototype.$notify.instance = new Vue({
        el: document.createElement('div'),
        mounted() {
          document.body.appendChild(this.$el)
        },
        template: `${_clone}`
      })

    }

  }
}


Vue.use(setting)
