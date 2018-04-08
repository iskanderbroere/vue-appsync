import { ApolloLink } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"

export default () => {
  const httpLink = new HttpLink({ uri: process.env.GRAPHQL_ENDPOINT })
  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: { "X-Api-Key": process.env.API_KEY }
    })
    return forward(operation)
  })
  const link = middlewareLink.concat(httpLink)
  return {
    link,
    cache: new InMemoryCache()
  }
}
