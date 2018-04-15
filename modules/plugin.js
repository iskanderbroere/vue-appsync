import AWSAppSyncClient from "aws-appsync"
import "isomorphic-fetch"
import Vue from "vue"
import VueApollo from "vue-apollo"

Vue.use(VueApollo)

export default ctx => {
  const { isDev, app, beforeNuxtRender } = ctx

  const client = new AWSAppSyncClient(
    {
      url: process.env.GRAPHQL_ENDPOINT,
      region: "eu-west-1",
      auth: {
        type: "API_KEY",
        apiKey: process.env.API_KEY,
        connectToDevTools: isDev
      }
    },
    {
      defaultOptions: {
        ssrMode: process.server,
        ssrForceFetchDelay: 100,
        watchQuery: {
          fetchPolicy: "cache-and-network"
        }
      }
    }
  )

  const appsyncProvider = new VueApollo({
    defaultClient: client
  })

  app.apolloProvider = appsyncProvider
  // Install the provider into the app
  app.provide = appsyncProvider.provide()

  if (process.server) {
    beforeNuxtRender(async ({ Components, nuxtState }) => {
      Components.forEach(Component => {
        // Fix https://github.com/nuxt-community/apollo-module/issues/19
        if (Component.options && Component.options.apollo && Component.options.apollo.$init) {
          delete Component.options.apollo.$init
        }
      })
      await appsyncProvider.prefetchAll(ctx, Components)
      nuxtState.apollo = appsyncProvider.getStates()
    })
  }
}
