export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'PPE Messager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [{ src: '@/assets/less/vant.less', lang: 'less' }],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vant',
    { src: '@/plugins/anime', ssr: false },
    '@/plugins/axios',
    { src: '~/plugins/lottie.js', ssr: false },
    '@/plugins/vue-signature-pad'
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
    '@nuxtjs/dayjs',
    '@nuxtjs/proxy'
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

  axios: {
    proxy: true // Can be also an object with default options
  },

  proxy: {
    '/bunny/': {
      target: process.env.VITE_BUNNY_URL,
      pathRewrite: {
        '^/bunny/': ''
      }
    },
    '/api': {
      target: process.env.SMILE_EYE_SERVER,
      pathRewrite: {
        '^/api/': ''
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Smileeye Messager',
      lang: 'vi',
      useWebmanifestExtension: false
    },
    icon: {
      source: 'static/pwa/icon.jpeg'
    }
  },

  router: {
    middleware: 'auth',
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
