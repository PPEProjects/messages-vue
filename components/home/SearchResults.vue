<template>
  <div class="px-4 mt-1 relative">

    <ul ref="choices" class="flex flex-wrap -mx-3 px-1 py-1 absolute top-0">
      <li v-for="(user, index) in choices" :key="user.id" :data-index="index" class="px-3 py-0.5">
        <div class="w-[64px] h-[64px] relative">
          <img class="w-full h-full rounded-full shadow-md border-[4px] border-white" :src="user.avatar" alt="" />
          <button class="absolute top-0 right-0 text-white bg-rose-500 w-5 h-5 rounded-full overflow-hidden border-2 border-white flex justify-center items-center shadow-lg shadow-rose-300" @click="removeAt(index)">
            <van-icon size="10" name="cross" />
          </button>
        </div>
      </li>
    </ul>

    <ul ref="results" class="relative bg-white">
      <li v-for="(user, index) in users" :key="index" class="py-4 border-b border-gray-100 last:border-0 search-item opacity-0">

        <div class="relative">
          <div
            class="flex items-center cursor-pointer relative z-10"
            :class="{
            'opacity-50': choices.findIndex((e) => e.id === user.id) >= 0
          }"
            @click="choiseUser(user)"
          >

            <avatar-border :avatar="user.avatar" />

            <h3 class="ml-3">{{ user.name }}</h3>

          </div>

          <button
            class="absolute top-1/2 right-3 transform -translate-y-1/2 flex justify-center items-center z-20 w-5 h-5 rounded overflow-hidden border anime _checkbox-animation"
            :class="{
              'opacity-0': !(choices.findIndex((e) => e.id === user.id) >= 0)
            }"
          >
            <van-icon
              class="text-primary-500 animate transform delay-100"
              :class="{
                'opacity-0 scale-0': !(choices.findIndex((e) => e.id === user.id) >= 0)
              }"
              name="success"
            />
          </button>

        </div>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchResults",
  props: {
    users: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      choices: [],
      transformY: 0,
      initValue: this.value
    }
  },
  watch: {
    choices: {
      handler() {
        this.$emit('input', this.choices)
      },
      deep: true
    }
  },
  methods: {
    choiseUser(user) {
      const _index = this.choices.findIndex((e) => e.id === user.id)
      if(_index >= 0) {
        this.choices = this.choices.filter((e) => e.id !== user.id)
      } else {
        this.choices = [...this.choices, user]
      }
      this.$emit('choiseUser', user)
    },

    removeAt(_index) {
      this.choices = this.choices.filter((_, index) => index !== _index)
    }
  }
}
</script>
