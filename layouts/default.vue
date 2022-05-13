<template>

  <div class="bg-gray-50 min-h-screen">

    <icons-view />

    <div id="body" class="w-screen max-w-2xl mx-auto shadow-lg shadow-primary-100 bg-white min-h-screen">
      <div
        :id="$route.name"
        class="text-slate-900 relative min-h-screen"
      >
        <nuxt />
      </div>
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
</style>
