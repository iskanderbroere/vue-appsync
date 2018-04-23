import AWSAppSyncClient from "aws-appsync"
import Vue from "vue"
import VueApollo from "vue-apollo"

Vue.use(VueApollo)

export default ({ isDev, app }) => {
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
}
