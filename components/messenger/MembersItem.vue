<template>

  <van-swipe-cell :before-close="beforeClose" :disabled="roomGet.users.length <= 2">
    <div class="py-3 border-b last:border-0 border-gray-100 flex items-center cursor-pointer">
      <div class="relative flex-shrink-0">
        <a class="relative z-10 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md block" href="/profile/47475">
          <img class="animate image-hover-zoom w-full h-full object-cover" src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1021.jpg" alt="">
        </a>
      </div>
      <div class="w-full ml-4 mr-auto">
        <div>
          <h4 class="font-medium text-[15px] line-clamp-1">
            {{ member.name || 'Unknown' }}
          </h4>
          <div class="mt-1 text-gray-400 flex items-center">
            <van-icon name="location-o" />
            <span class="text-[12px] ml-0.5">
            {{ member.location || 'Viet Nam' }}
          </span>
          </div>
        </div>
      </div>
    </div>
    <template #right>
      <van-button text="Delete" type="danger" class="delete-button" />
    </template>
  </van-swipe-cell>

</template>

<script>
import {mapGetters} from "vuex";
import {GET_ROOM} from "~/apollo/queries/room.queries";
import {KICK_MEMBERS} from "~/apollo/mutation/message.mutation";

export default {
  name: "MembersItem",
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roomGet: {
        users: []
      },
    }
  },
  apollo: {
    roomGet: {
      query: GET_ROOM,
      variables() {
        return {
          roomId: this.$route.params.id,
          userId: this.$store.state.user.id
        }
      },
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    beforeClose({ position, instance }) {
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          this.$dialog.confirm({
            message: 'Are you sure to delete?',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Delete'
          })
            .then(() => this.kickUser(instance));
          break;
      }
    },
    async kickUser(instance) {
      this.$nuxt.$loading.start()
      try {
        await this.$apollo.mutate({
          mutation: KICK_MEMBERS,
          variables: {
            input: {
              roomID: this.$route.params.id,
              userIDs: [String(this.member.userID)]
            }
          }
        })
        this.$notify({
          type: 'success',
          message: 'Kick member successfully!'
        })
        instance.close()
      } catch (e) {}
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
