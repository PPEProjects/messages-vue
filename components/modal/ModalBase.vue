<template>
  <div
    :id="event"
    class="fixed flex h-full items-center justify-center top-0 w-full z-50 transition duration-500 ease-in-out left-0"
    :class="{
      'invisible opacity-0': !open
    }"
  >
    <a class="absolute top-0 left-0 w-full h-full close-overlay cursor-pointer" title="Close" @click="dispose()" />
    <div
      :id="`${event}Body`"
      ref="body"
      class="border-primary-600 border-t-4 modal-content relative py-7 w-full bg-white mx-3 sm:mx-0 overflow-hidden relative"
      :style="
        {
          maxWidth: maxWidth + 'px'
        }
      "
    >
      <a class="-translate-x-7 z-10 absolute close-button right-0 text-xl top-0 transform translate-y-5 cursor-pointer" @click="dispose()">
        <svg ref="closeButton" class="fill-current opacity-0" width="18" height="18">
          <use xlink:href="#i-times" />
        </svg>
      </a>

      <div class="px-7">
        <h4
          v-if="title"
          class="font-semibold text-gray-600 text-xl lg:text-2xl pb-1"
        >
          {{ title }}
        </h4>

        <div
          :id="`${event}Content`"
          class="max-h-screen-80 overflow-y-auto overflow-x-hidden scrollbar-none"
        >
          <slot :show="open" :data="data" />
        </div>
      </div>

      <div v-if="$slots['bottom']" class="px-7 relative">
        <div class="w-full h-px bg-gray-200 mt-3.5 mb-3" />

        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalBase',
  props: {
    event: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: null
    },
    maxWidth: {
      type: Number,
      default: 550
    }
  },
  data() {
    return {
      open: false,
      data: null,
    }
  },
  methods: {

    dispose() {
      this.open = false
    },

    init() {
      this.open = true
      this.$anime({
        targets: this.$refs.body,
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 1500
      })

      this.$anime({
        targets: this.$refs.closeButton,
        scale: [0, 1],
        opacity: [0, 1],
        delay: 500,
        duration: 1500
      })
    }
  }
}
</script>
