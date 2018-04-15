<template>
  <p>{{ event }}</p>
</template>

<script>
import EVENT_GET from "~/apollo/queries/eventGet.gql"
import COMMENT_SUBSCRIBE from "~/apollo/subscriptions/commentSubscription.gql"

export default {
  data() {
    return {
      event: {}
    }
  },
  apollo: {
    event: {
      query: EVENT_GET,
      subscribeToMore: {
        document: COMMENT_SUBSCRIBE
      },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { subscribeToEventComments }
          }
        }
      ) => {
        debugger
        const res = {
          ...prev,
          ...{
            getEvent: {
              ...prev.getEvent,
              comments: {
                __typename: "CommentConnections",
                items: [
                  ...prev.getEvent.comments.items.filter(c => {
                    return (
                      c.content !== subscribeToEventComments.content &&
                      c.createdAt !== subscribeToEventComments.createdAt &&
                      c.commentId !== subscribeToEventComments.commentId
                    )
                  }),
                  subscribeToEventComments
                ]
              }
            }
          }
        }

        return res
      },
      variables() {
        return { id: this.$route.params.id }
      },
      update: data => data.getEvent,
      error(error) {
        console.error("We've got an error!", error)
      }
    }
  }
}
</script>
