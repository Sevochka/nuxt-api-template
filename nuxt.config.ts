import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import graphqlLoader from 'vite-plugin-graphql-loader';
import {
  isDebug,
  ENV,
  isDev,
  isStage,
} from './config/variables';

export default defineNuxtConfig({

  extends: [
    [
      './layers/api',
    ],
  ],

  // Модули
  modules: [
    '@hypernym/nuxt-gsap',
    'nuxt-swiper',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/fontaine',
    '@nuxt/icon',
    '@nuxt/eslint',
  ],

  ssr: true,

  // auto import components
  components: [
    { path: '@/components', pathPrefix: false },
  ],

  imports: {
    autoImport: true,
  },

  // css
  css: ['@/assets/scss/main.scss', '@/assets/scss/skeleton/skeleton-mammoth.scss'],

  runtimeConfig: {
    public: {
      originUrl: '',
      backendUrl: '',

      // Calculated on runtime
      environment: ENV,
      isDev,
      isStage,
      isDebug,
    },
  },

  alias: {
    '~api': '../layers/api',
  },

  sourcemap: isDebug,

  experimental: {
    componentIslands: true,
    asyncContext: true,
    clientFallback: true,
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  vite: {
    logLevel: 'info',
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    define: {
      // set apollo dev mode https://www.apollographql.com/docs/react/development-testing/reducing-bundle-size/#turning-off-development-mode
      'globalThis.__DEV__': JSON.stringify(isDebug),
    },
    plugins: [
      graphqlLoader(),
      // https://github.com/FatehAK/vite-plugin-image-optimizer#svg
      ViteImageOptimizer({
        test: /\.(svg)$/i,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/assets/scss/responsive.scss"; @import "@/assets/scss/mixins.scss"; @import "@/assets/scss/variables.scss";',
        },
      },
    },
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        strict: true,
        types: ['@pinia/nuxt'],
      },
    },
  },

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  telemetry: {
    enabled: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  icon: {
    customCollections: [
      {
        prefix: 'icons',
        dir: './app/assets/icons',
      },
    ],
  },

  vueuse: {
    ssrHandlers: true,
  },
});
