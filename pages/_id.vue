<template>
  <article>
    <h1>{{ event.name }}</h1>
    <address>{{ event.where }}</address>
    <time>{{ event.when }}</time>
    <form @submit.prevent="commentOnEvent()">
      <input v-model.trim="newComment.content" type="text" placeholder="Comment...">
    </form>
    <ul>
      <li v-for="comment in event.comments.items" :key="comment.commentId">
        {{ comment.commentId }}
      </li>
    </ul>
  </article>
</template>

<script>
import EVENT_GET from "~/apollo/queries/eventGet.gql"
import COMMENT_ON_EVENT from "~/apollo/mutations/commentOnEvent.gql"
import COMMENT_SUBSCRIBE from "~/apollo/subscriptions/commentSubscription.gql"

export default {
  data() {
    return {
      newComment: {
        content: ""
      },
      event: {
        comments: {
          items: []
        }
      }
    }
  },
  methods: {
    commentOnEvent() {
      const newComment = {
        ...this.newComment,
        eventId: this.$route.params.id,
        createdAt: Date.now()
      }
      try {
        this.$apollo.mutate({
          mutation: COMMENT_ON_EVENT,
          variables: newComment,
          update: (proxy, { data: { commentOnEvent } }) => {
            const query = EVENT_GET
            const data = proxy.readQuery({
              query: EVENT_GET,
              variables: {
                id: this.$route.params.id
              }
            })
            data.getEvent.comments.items = [
              ...data.getEvent.comments.items.filter(e => e.commentId !== -1),
              commentOnEvent
            ]
            proxy.writeQuery({ query, data })
          },
          optimisticResponse: {
            __typename: "Mutation",
            commentOnEvent: {
              ...newComment,
              commentId: -1,
              __typename: "Comment"
            }
          }
        })
      } catch (e) {
        console.error(e)
        this.newComment = newComment
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

<style scoped>
article {
  padding: 50px;
  margin: 50px;
  border: 1px solid #cad0d2;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  margin-bottom: 10px;
  padding: 5px 8px;
  flex-direction: column;
  border: 1px solid #cad0d2;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
