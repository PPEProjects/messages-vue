<template>
  <div class="w-[70px] flex-shrink-0 chat-user">
    <div class="w-[50px] h-[50px] rounded-full overflow-hidden border-[3px] border-white shadow-lg">
      <img
      class="w-full h-full object-cover"
      :src="avatar"
      alt=""
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "BubbleAvatar",
  props: {
    avatar: {
      type: String,
      default: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/454.jpg'
    }
  }
}
</script>
