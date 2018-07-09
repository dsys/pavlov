import fetch from 'unfetch';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { useAuth, getAuthHeader } from './auth';

const GRAPHQL_ENDPOINT = '/v1/graphql';

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT, fetch });

const authLink = setContext(() => {
  return {
    headers: {
      Authorization: getAuthHeader()
    }
  };
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError && networkError.statusCode === 401) {
    useAuth(null);
  }
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache()
});

export default apolloClient;
