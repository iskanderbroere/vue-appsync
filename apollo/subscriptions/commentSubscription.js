import gql from "graphql-tag"

export default gql(`
subscription($id: String!) {
  subscribeToEventComments(eventId: $id){
    eventId
    commentId
    content
  }
}`)
