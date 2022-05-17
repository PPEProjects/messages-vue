<template>
  <modal-base ref="modal" title="Login" event="authModal" :max-width="450">
    <template #default="{ show }">
      <div style='width: 180px; height: 180px' class='mx-auto mt-3'>
        <template v-if='show'>
          <v-lottie-player
            width='180px'
            height='180px'
            loop
            path="https://assets8.lottiefiles.com/packages/lf20_unycsfzn.json"
          />
        </template>
        <div v-else></div>
      </div>
      <div class="text-center">
        <small class="text-xs italic opacity-90 text-gray-400">Experience to learn</small>
      </div>
      <form id="authForm" class="max-w-xs mx-auto" @submit.prevent="login()">
        <div class="pb-2 pt-1 relative my-4">
          <div class="flex items-center">
            <label for="inputEmail" class="block mr-3">
              <svg width="18" height="18" class="fill-current text-gray-400">
                <use xlink:href="#i-email" />
              </svg>
            </label>
            <input id="inputEmail" v-model="email" placeholder="Email ID" type="text" class="focus:outline-none block flex-1 bg-transparent text-sm text-gray-600">
          </div>
          <span class="block absolute w-full left-0 bottom-0 bg-gray-200 h-0.5 ease-in-out transition duration-300 bg-primary-600" />
        </div>
        <div class="pb-2 pt-1 relative my-4">
          <div class="flex items-center">
            <label for="inputPassword" class="block mr-4">
              <svg width="18" height="18" class="fill-current text-gray-400">
                <use xlink:href="#i-password" />
              </svg>
            </label> <input
              id="inputPassword"
              v-model="password"
              placeholder="Password"
              type="password"
              class="focus:outline-none block flex-1 bg-transparent text-sm  text-gray-600"
            > <a
              class="block text-xs text-primary-500 ml-3 cursor-pointer flex-shrink-0"
            >Forgot Password?</a>
          </div>
          <span
            class="block absolute w-full left-0 bottom-0 bg-gray-200 h-0.5 ease-in-out transition duration-300 bg-primary-600"
          />
        </div>
        <div class="text-xs text-center my-1">
          <p class="text-gray-400">
            Don't have account?
            <a class="text-primary-500 cursor-pointer ml-1">SignUp now</a>
          </p>
        </div>

        <div class="h-2"></div>

        <van-button round block size="small" type="primary">Login</van-button>

        <div>
          <div class="flex items-center mt-5">
            <span class="w-full h-px bg-gray-200" />
            <span class="flex-shrink-0 text-xs font-medium text-gray-400 mx-3">OR CONTINUE WITH</span>
            <span class="w-full h-px bg-gray-200" />
          </div>
          <div class="flex items-center justify-center mt-5">
            <button class="scale-95 transform mx-3">
              <img width="25" height="25" src="/images/logo/gg.png" alt="">
            </button>
            <button class="mx-3 transform -translate-y-0.5">
              <img src="/images/logo/apple.png" alt="" class="h-[25px] w-auto object-cover">
            </button>
          </div>
        </div>
      </form>
      <div class="text-xs text-center mt-5 text-gray-400">
        <span class="mr-1">© 2022 PPE</span>
        <i>|</i>
        <span class="mx-1">Terms of Service</span>
        <i>|</i>
        <span class="ml-1">Privacy Policy</span>
      </div>
    </template>
  </modal-base>
</template>

<script>
export default {
  name: 'ModalAuth',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    isReady() {
      return this.email.length > 0 && this.password.length > 0
    }
  },
  mounted() {
    setTimeout(() => { this.$refs.modal.init() }, 500)
  },
  methods: {

    async login() {
      try {
        const { data } = await this.$axios.$post('https://v2-be.smileeye.edu.vn/ppe-core/auth/login', { email: this.email, password: this.password})
        await this.$cookies.set('_token', data.token)
        this.$toast.success({ message: 'Success' })
        window.location.reload()
      } catch (e) {
        this.$toast.fail({ message: 'Failed' })
      }
    }

  }
}
</script>
