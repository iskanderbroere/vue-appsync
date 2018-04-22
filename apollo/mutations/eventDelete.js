import gql from "graphql-tag"

export default gql(`
mutation eventDelete($id: ID!) {
  deleteEvent(id: $id) {
    id
  }
}`)
