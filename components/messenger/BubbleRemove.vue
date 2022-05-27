<template>

  <button class="absolute mt-3 text-gray-400 -left-6 _recall_button" @click="remove()">
    <svg class="fill-current" width="15" height="15">
      <use xlink:href="#i-remove"/>
    </svg>
  </button>

</template>

<script>
import {RECALL_INBOX} from "~/apollo/mutation/message.mutation";

export default {
  name: "BubbleRemove",
  props: {
    inbox: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    async remove() {
      await this.$apollo.mutate({
        mutation: RECALL_INBOX,
        variables: {
          "removeInboxId": this.inbox.id,
          "group": this.type
        }
      })
      this.$notify({ message: 'Successful message recall', type: 'success' })
    }
  }
}
</script>
