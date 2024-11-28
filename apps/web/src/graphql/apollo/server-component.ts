import {
  ApolloClient,
  registerApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { typePolicies } from './apollo-client'
import { from, HttpLink } from '@apollo/client'
import { GRAPHQL_URL } from '@/constants/server'
import { setContext } from '@apollo/client/link/context'
import { getCookie } from 'cookies-next'
import { cookies } from 'next/headers'
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename'

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie('telescope-auth', { cookies })
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  }
})

export const serverApolloClient = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: typePolicies,
    }),
    link: from([
      removeTypenameFromVariables(),
      authLink,
      new HttpLink({
        uri: GRAPHQL_URL,
      }),
    ]),
  })
})
