<template>
  <div
    class="flex my-10 items-start chat-item opacity-0"
    :data-current="isOwn"
    :data-id="inbox.id"
    :data-recall="inbox.isRecall"
    :class="{
      'flex-row-reverse': isOwn
    }"
  >

    <div
      class="w-[50px] h-[50px] rounded-full overflow-hidden border-[3px] border-white shadow-lg flex-shrink-0"
      :class="{
        'ml-5': isOwn,
        'mr-5': !isOwn
      }"
    >
      <img class="w-full h-full object-cover" :src="inbox.from.avatar" alt="">
    </div>

    <slot></slot>

    <div class="w-[70px] flex-shrink-0 mx-auto"></div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "MessageBubble",
  props: {
    inbox: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isOwn: false,
      instance: undefined,
      showDelete: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    isRead() {
      return this.inbox.readAt.includes((e) => {
        return e.inbox.userID === String(this.user.id);
      });
    }
  },
  mounted() {
    this.setup()
  },
  methods: {
    setup() {

      this.isOwn = this.inbox.from.userID === String(this.user.id)

    },

    showPopup() {
      const react = this.$el.getBoundingClientRect()

      const _clone = this.$el.cloneNode(true)
      // reset inline
      _clone.removeAttribute('style')
      _clone.classList.remove('my-10')
      _clone.classList.add('_recall_modal')
      /**
       * get with, height, offset => clone to body => new vue
       */

      const $div = document.createElement('div')
      $div.classList.add('fixed', 'top-0', 'bottom-0', 'left-0', 'right-0')
      $div.style.zIndex = '10000'


      // xoá button
      const $a = document.createElement('a')
      $a.classList.add('absolute', 'top-0', 'bottom-0', 'right-0', 'left-0', 'cursor-pointer')
      $a.style.background = '#0000003b'
      $a.addEventListener('click', () => {
        $div.remove()
        document.querySelector('html').classList.remove('_show_index_modal')
      }, { once: true })

      $div.appendChild($a)


      const $container = document.createElement('div')
      $container.style.width = react.width + 'px'
      $container.style.left = react.left + 'px'
      $container.style.top = react.top + 'px'
      $container.style.position = 'relative'

      // inbox clone
      $container.appendChild(_clone)

      // option popup
      const $option = document.createElement('div')
      $option.classList.add('bg-white', 'shadow-lg', 'px-4')
      $option.innerHTML = `
        <button id="cancelCallButton" class="bg-red-500 w-10 h-10 rounded-full flex justify-center items-center">
            <svg class="fill-current" width="20" height="20">
              <use xlink:href="#i-video-cam-off" />
            </svg>
          </button>
      `

      $container.appendChild($option)

      $div.appendChild($container)

      // chặn scroll + gắn vào doom
      document.querySelector('html').classList.add('_show_index_modal')
      document.querySelector('html').appendChild($div)

      // animation
      this.$anime({
        targets: '._recall_modal',
        opacity: [0, 1]
      })

    }

  }
}
</script>
