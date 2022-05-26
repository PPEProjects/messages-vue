// import Vue from 'vue'
/* global $nuxt */

export default ({ app, store }, inject) => {

  /**
   * @property { jitsi } Vue.prototype.$jitsi
   */
  const jitsi = {

    /**
     * @param { Number } popupWinWidth
     * @param { Number } popupWinHeight
     * @param { () => void } onCancel
     */
    open: ( popupWinWidth, popupWinHeight, onCancel) => {

      if($nuxt.$route.name !== 'messenger') {
        // chỉ mở từ trang phòng
        return
      }
      const roomID = $nuxt.$route.params.id

      const left = (screen.width - popupWinWidth) / 2;
      const top = (screen.height - popupWinHeight) / 4;
      const newWindow = window.open('http://localhost:3000/groupcall?room=' + roomID , 'Smileeye Call','resizable=yes, width=' + popupWinWidth + ', height=' + popupWinHeight + ', top=' + top + ', left=' + left);
      if (newWindow.onbeforeunload) {
        // bị huỷ mở cửa sổ
        onCancel()
      }
    },

    call: (id) => {
      return  new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: id,
        width: '100%',
        height: window.innerHeight,
        parentNode: document.querySelector('#callInstance'),
        interfaceConfigOverwrite: {},
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableLocalVideoFlip: false,
          disableSelfView: false
        },
        userInfo: {
          displayName: store.getters['user/user'].name
        }
      })
    }
  }

  inject('jitsi', jitsi)
}
