import {
  ApolloClient,
  ApolloLink,
  HttpLink,
} from '@apollo/client/core';
import { APOLLO_CACHE } from './apollo-cache';

type CreateApolloClientOptions = {
  httpLinkOptions: ConstructorParameters<typeof HttpLink>[0]
}

const createApolloClient = ({ httpLinkOptions }: CreateApolloClientOptions) => {
  // Custom link to add headers
  const customLink = new ApolloLink((operation, forward) => {
    const headers = useRequestHeaders(['cookie']);
    operation.setContext(({ headers: existingHeaders = {} }) => ({
      headers: {
        ...existingHeaders,
        ...headers,
      },
    }));
    return forward(operation);
  });

  // Combining the custom link with the http link
  const httpLink = new HttpLink(httpLinkOptions);
  const link = ApolloLink.from([customLink, httpLink]);

  return new ApolloClient({
    cache: APOLLO_CACHE,
    link,
    ssrMode: true,
    // Отключение кеширования запросов
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
};

export {
  createApolloClient,
};
