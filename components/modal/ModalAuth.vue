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
      <form id="authForm" class="max-w-xs mx-auto" @submit.prevent="authAction()">

        <div v-if="!isLogin" class="pb-2 pt-1 relative my-4">
          <div class="flex items-center">
            <label for="inputEmail" class="block mr-3">
              <svg width="18" height="18" class="fill-current text-gray-400">
                <use xlink:href="#i-user" />
              </svg>
            </label>
            <input id="inputEmail" v-model="name" placeholder="Your Name" type="text" class="focus:outline-none block flex-1 bg-transparent text-sm text-gray-600">
          </div>
          <span class="block absolute w-full left-0 bottom-0 bg-gray-200 h-0.5 ease-in-out transition duration-300 bg-primary-600" />
        </div>

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
            </label>
            <input
              id="inputPassword"
              v-model="password"
              placeholder="Password"
              type="password"
              class="focus:outline-none block flex-1 bg-transparent text-sm  text-gray-600"
            >
            <a
              v-if="isLogin"
              class="block text-xs text-primary-500 ml-3 cursor-pointer flex-shrink-0"
            >Forgot Password?</a>
          </div>
          <span
            class="block absolute w-full left-0 bottom-0 bg-gray-200 h-0.5 ease-in-out transition duration-300 bg-primary-600"
          />
        </div>

        <div v-if="isLogin" class="text-xs text-center my-1">
          <p class="text-gray-400">
            Don't have account?
            <a class="text-primary-500 cursor-pointer ml-1" @click="isLogin = false">SignUp now</a>
          </p>
        </div>

        <div v-else class="text-xs text-center my-1">
          <p class="text-gray-400">
            Do you already have an account ?
            <a class="text-primary-500 cursor-pointer ml-1" @click="isLogin = true">Login now</a>
          </p>
        </div>

        <div class="h-2"></div>

        <van-button
          :loading="isLoading"
          round
          block
          size="small"
          type="primary"
          class="animate"
          :class="{
            'opacity-50': !isReady
          }"
        >
          {{ isLogin ? 'Login' : 'Signup' }}
        </van-button>

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
      password: '',
      name: '',
      isLogin: true,
      isLoading: false
    }
  },
  computed: {
    isReady() {
      return this.isLogin ? this.email.length > 0 && this.password.length > 0 : this.email.length > 0 && this.password.length > 0 && this.name.length
    }
  },
  mounted() {
    setTimeout(() => { this.$refs.modal.init() }, 500)
  },
  methods: {

    async authAction() {
      if(!this.isReady) {
        return
      }
      this.isLoading = true
      if(this.isLogin) {
        await this.login()
      } else {
        await this.singup()
      }
      this.isLoading = false
    },

    async login() {
      try {
        const { data } = await this.$axios.$post('/api/ppe-core/auth/login', { email: this.email, password: this.password})
        await this.$cookies.set('_token', data.token)
        this.$toast.success({ message: 'Success' })
        window.location.reload()
      } catch (e) {
        this.$toast.fail({ message: 'Failed' })
      }
    },

    async singup() {
      try {
        const { data } = await this.$axios.$post('/api//ppe-core/auth/register', {
          email: this.email,
          password: this.password,
          password_confirmation: this.password,
          name: this.name
        })
        await this.$cookies.set('_token', data.access_token)
        this.$toast.success({ message: 'Success' })
        window.location.reload()
      } catch ({ message }) {
          this.$notify({ message, type: 'danger' })
      }
    }

  }
}
</script>

<style>
#authModal ._close {
  display: none;
}
</style>
