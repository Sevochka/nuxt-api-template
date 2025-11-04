import type { IApiInstance } from './types/api';

declare module '#app' {
  interface NuxtApp {
    $api: IApiInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: IApiInstance
  }
}
