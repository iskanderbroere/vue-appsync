import gql from "graphql-tag"

export default gql(`
mutation eventCreate($eventId: ID! $content: String! $createdAt: String!) {
  commentOnEvent(eventId: $eventId content: $content createdAt: $createdAt) {
    eventId
    commentId
    content
    createdAt
  }
}`)
