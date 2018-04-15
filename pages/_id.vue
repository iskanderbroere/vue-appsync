<template>
  <article>
    <h1>{{ event.name }}</h1>
    <ul>
      <li v-for="comment in event.comments.items" :key="comment.commentId">
        {{ comment.content }}
      </li>
    </ul>
  </article>
</template>

<script>
import EVENT_GET from "~/apollo/queries/eventGet.gql"
import COMMENT_SUBSCRIBE from "~/apollo/subscriptions/commentSubscription.gql"

export default {
  data() {
    return {
      event: {
        comments: {
          items: []
        }
      }
    }
  },
  apollo: {
    event: {
      query: EVENT_GET,
      prefetch: true,
      subscribeToMore: {
        document: COMMENT_SUBSCRIBE,
        variables() {
          return { id: this.$route.params.id }
        },
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { subscribeToEventComments }
            }
          }
        ) => {
          const res = {
            ...prev,
            ...{
              getEvent: {
                ...prev.getEvent,
                comments: {
                  __typename: "CommentConnection",
                  items: [
                    ...prev.getEvent.comments.items.filter(c => {
                      return c.commentId !== subscribeToEventComments.commentId
                    }),
                    subscribeToEventComments
                  ]
                }
              }
            }
          }
          return res
        }
      },
      variables() {
        return { id: this.$route.params.id }
      },
      update: data => {
        return data.getEvent
      },
      error(error) {
        console.error("We've got an error!", error)
      }
    }
  }
}
</script>
