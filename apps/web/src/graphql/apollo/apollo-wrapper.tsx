'use client'

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support'
import { apolloClient } from './apollo-client'

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={() => apolloClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
