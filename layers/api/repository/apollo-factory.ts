import {
  ApolloClient,
  type DocumentNode,
} from '@apollo/client/core';
import { GraphQLError } from 'graphql/error';

class ApolloFactory {
  private readonly client: ApolloClient;

  constructor(client: ApolloClient) {
    this.client = client;
  }

  private handleError = (error?: Error | readonly GraphQLError[]) => {
    useSentry(sentry => sentry?.captureException(error));
  };

  async query<T>(query: DocumentNode, variables?: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.client.query<T>({
        query,
        variables,
      });

      return data as T;
    }
    catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async mutate<T>(mutation: DocumentNode, variables?: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.client.mutate<T>({
        mutation,
        variables,
      });

      return data as T;
    }
    catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }
}

export default ApolloFactory;
