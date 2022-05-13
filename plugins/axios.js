export default function ({ $axios, $cookies }) {
  $axios.onRequest((config) => {
    config.headers.common.Authorization = 'Bearer ' + $cookies.get('apollo-token')
  })
}
