// import Vue from 'vue'
/* global $nuxt */

export default ({ app, store }, inject) => {

  /**
   * @property { jitsi } Vue.prototype.$jitsi
   */
  const jitsi = {

    /**
     * @param { String } id
     * @param { Number } popupWinWidth
     * @param { Number } popupWinHeight
     * @param { () => void } onCancel
     */
    open: ( id, popupWinWidth, popupWinHeight, onCancel = () => {}) => {
      $nuxt.$emit('videoConferenceJoinCallback')

      const left = (screen.width - popupWinWidth) / 2;
      const top = (screen.height - popupWinHeight) / 4;
      const newWindow = window.open('https://chat1.smileeye.edu.vn/groupcall?room=' + id , 'Smileeye Call','resizable=yes, width=' + popupWinWidth + ', height=' + popupWinHeight + ', top=' + top + ', left=' + left);
      if (newWindow.onbeforeunload) {
        // bị huỷ mở cửa sổ
        $nuxt.$emit('videoConferenceLeftCallback')
        onCancel()
      }
    },

    call: (id) => {

      $nuxt.$emit('videoConferenceJoinCallback')

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
