<template>

  <div class="bg-gray-50 min-h-screen">

    <icons-view />

    <div id="body" class="w-screen max-w-2xl mx-auto shadow-lg shadow-primary-100 bg-white min-h-screen">
      <div
        :id="$route.name"
        class="text-slate-900 relative min-h-screen"
      >
        <nuxt :key="$route.fullPath" />
      </div>
    </div>


    <div v-if="$route.name === 'index'" id="logoutButton" class="sticky bg-primary-500 z-50 cursor-pointer" @click="logout">
      Đăng Xuất
      <svg class="fill-current ml-2" width="18" height="18">
        <use xlink:href="#i-logout"/>
      </svg>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'

import {MESSAGE_CONNECT} from "~/apollo/subscription/connect.subscription";

export default {
  name: 'DefaultLayout',
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  apollo: {
    $subscribe: {
      connect: {
        query: MESSAGE_CONNECT,
        variables() {
          return {
            input: {
              user: {
                name: this.user.name || '',
                avatar: this.user.avatar || '',
                userID: String(this.user.id || '')
              }
            }
          }
        }
      }
    }
  },
  watch: {
    isOpen() {
      if (!this.isOpen) {
        this.$anime({
          targets: '.sidebar',
          width: [64, 280],
          duration: 1200
        })
      } else {
        this.$anime({
          targets: '.sidebar',
          width: [280, 64],
          duration: 1200

        })
      }
    }
  },
  methods: {
    logout() {
      this.$cookies.removeAll()
      window.location.href = '/'
    }
  }
}
</script>
<style>
#page-body {
  height: calc(100vh - 70px);
}
#page-body > div {
  min-height: calc(100vh - 70px - 35px - 35px);
}
</style>

<style>
#sidebarInput:checked + div > ul .menu-item span {
  display: none;
}
#sidebarInput:checked+div>ul .menu-item > a {
  padding-left: calc(4px + 12px);
}
#sidebarInput:checked+div> .logo {
  opacity: 0;
  transform: scale(0);
}
#sidebarInput:not(:checked) + div > ._show_btn {
  opacity: 0;
  transform: scale(0);
}

#logoutButton {
  position: fixed;
  bottom: 30px;
  right: 30px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 0 5px rgba(59, 102, 244, 0.99);
}
</style>
