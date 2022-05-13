export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'messages',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['vant/lib/index.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vant',
    { src: '@/plugins/anime', ssr: false },
    '@/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [{ path: '~/components', pathPrefix: false }],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    ['@nuxtjs/dotenv', { filename: '.env' }],
    '@nuxtjs/tailwindcss',
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'portal-vue/nuxt',
    '@nuxtjs/apollo',
    'cookie-universal-nuxt',
    '@nuxtjs/dayjs'
  ],

  loading: { color: '#3b66f5', height: '3px', throttle: 0 },

  dayjs: {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    defaultTimeZone: 'Asia/Ho_Chi_Minh',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone' // import 'dayjs/plugin/timezone'
    ] // Your Day.js plugin
  },

  apollo: {
    // Sets up the graphql client endpoints
    clientConfigs: {
      // recommended: use a file to declare the client configuration (see below for example)
      default: '~/plugins/apollo.js'
    },
    includeNodeModules: true
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'vi'
    }
  },

  router: {
    // middleware: 'auth',
    extendRoutes(routes, resolve) {
      routes.forEach((route) => {
        if (route.name === 'messenger') {
          route.path = '/messenger/:id'
        }
      })
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  server: {
    port: process.env.PORT, // default: 3000
    host: 'localhost', // default: localhost,
    timing: false
  }
}
