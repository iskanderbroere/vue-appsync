<template>
  <div>
    <form @submit.prevent="createEvent()">
      <input v-model.trim="newEvent.name" placeholder="Name">
      <input v-model.trim="newEvent.where" placeholder="Location">
      <input v-model.trim="newEvent.description" placeholder="Description">
      <button type="submit">Submit</button>
    </form>
    <event-list />
  </div>
</template>

<script>
import eventList from "~/components/eventList"
import EVENT_CREATE from "~/apollo/mutations/eventCreate.js"
import EVENT_LIST from "~/apollo/queries/eventList.js"

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
        where: "",
        description: null
      }
    }
  },
  methods: {
    createEvent() {
      const newEvent = {
        ...this.newEvent,
        when: Date.now()
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
