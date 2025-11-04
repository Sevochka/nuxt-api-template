import { $fetch } from 'ofetch';
import type { FetchOptions } from 'ofetch';
import { defineNuxtPlugin } from '#app';
import { createApolloClient } from '../utils/apollo';
import type { IApiInstance } from '../types/api';

export default defineNuxtPlugin(() => {
  const {
    public: {
      backendUrl,
    },
  } = useRuntimeConfig();

  const gqlBackendUrl = backendUrl + '/graphql';

  const fetchOptions: FetchOptions = {
    baseURL: 'http://any-url.com/',
  };

  const apiFetcher = $fetch.create(fetchOptions);

  const apolloClientMain = createApolloClient({
    httpLinkOptions: {
      uri: gqlBackendUrl,
      credentials: 'include',
    },
  });

  const modules: IApiInstance = {
    // Сюда будут добавляться модули

    client: apolloClientMain,
  };

  return {
    provide: {
      api: modules,
    },
  };
});
