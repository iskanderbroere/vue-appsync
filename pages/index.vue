<template>
  <main>
    <form @submit.prevent="createEvent()">
      <input v-model.trim="newEvent.name" placeholder="edit me">
      <input v-model.trim="newEvent.when" placeholder="edit me">
      <input v-model.trim="newEvent.where" placeholder="edit me">
      <input v-model.trim="newEvent.description" placeholder="edit me">
      <button type="submit">Submit</button>
    </form>
    <event-list />
  </main>
</template>

<script>
import eventList from "~/components/eventList"
import EVENT_CREATE from "~/apollo/mutations/eventCreate.gql"
import EVENT_LIST from "~/apollo/queries/eventList.gql"

export default {
  head: {
    title: "Events"
  },
  components: {
    eventList
  },
  data() {
    return {
      newEvent: {
        name: "",
        when: "",
        where: "",
        description: null
      }
    }
  },
  methods: {
    createEvent() {
      const newEvent = {
        ...this.newEvent,
        description: this.newEvent.description && this.newEvent.description !== "" ? this.newEvent.description : null
      }
      try {
        this.$apollo.mutate({
          mutation: EVENT_CREATE,
          variables: newEvent,
          update: (proxy, { data: { createEvent } }) => {
            const query = EVENT_LIST
            const data = proxy.readQuery({ query })
            data.listEvents.items = [...data.listEvents.items.filter(e => e.id !== -1), createEvent]
            proxy.writeQuery({ query, data })
          },
          optimisticResponse: {
            __typename: "Mutation",
            createEvent: {
              id: -1,
              ...newEvent,
              __typename: "Event",
              comments: { __typename: "CommentConnection", items: [] }
            }
          }
        })
      } catch (e) {
        console.error(e)
        this.newEvent = newEvent
      }
    }
  }
}
</script>
