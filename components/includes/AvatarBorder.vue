<template>
  <div>
    <div
      class="relative z-10 rounded-full overflow-hidden border-white shadow-md flex-shrink-0 mx-1"
      :class="[avatarClass]"
    >
      <img
        class="animate image-hover-zoom w-full h-full object-cover"
        :src="avatar || 'https://i.imgur.com/tBfOe5r.jpg'"
        alt=""
      />
    </div>

    <transition name="onlineX">
      <div v-if="onlines" class="absolute z-20 bottom-0 text-white right-0 w-6 h-6 rounded-full overflow-hidden border-[3px] border-white flex justify-center items-center shadow-md bg-green-500">
        <span v-if="onlines > 1" class="text-xs">{{ onlines }}</span>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: "AvatarBorder",
  props: {
    avatar: {
      type: String,
      default: 'https://i.imgur.com/tBfOe5r.jpg'
    },
    onlines: {
      type: Number,
      default: 0
    },
    avatarClass: {
      type: String,
      default: 'w-16 h-16 border-4'
    }
  },
}
</script>
