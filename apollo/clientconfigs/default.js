import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"

export default () => {
  const httpLink = new HttpLink({
    uri: "https://api.graph.cool/simple/v1/cj1dqiyvqqnmj0113yuqamkuu"
  })
  return {
    link: httpLink,
    cache: new InMemoryCache()
  }
}
