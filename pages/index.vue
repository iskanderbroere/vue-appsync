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
import { v4 as uuid } from "uuid"
import eventList from "~/components/eventList"
import EVENT_CREATE from "~/apollo/mutations/eventCreate"
import EVENT_LIST from "~/apollo/queries/eventList"

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
      const client = this.$apollo.getClient()
      const newEvent = {
        ...this.newEvent,
        description: this.newEvent.description && this.newEvent.description !== "" ? this.newEvent.description : null
      }
      try {
        client.mutate({
          mutation: EVENT_CREATE,
          variables: newEvent,
          update: (store, { data: { createEvent } }) => {
            let data = store.readQuery({ query: EVENT_LIST })
            data.listEvents.items.push(createEvent)
            store.writeQuery({ query: EVENT_LIST, data })
          },
          optimisticResponse: {
            __typename: "Mutation",
            createEvent: {
              ...newEvent,
              id: uuid(),
              __typename: "Event",
              comments: { __typename: "CommentConnection", items: [] }
            }
          }
        })
      } catch (e) {
        console.log(e)
        this.newEvent = newEvent
      }
    }
  }
}
</script>

<style>
.fa-icon {
  width: auto;
  height: 1em;
  /* old Safari */
  max-width: 100%;
  max-height: 100%;
}
body {
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: gray(35);
  font-size: 24px;
}
h1 {
  font-family: "Suez One", serif;
  font-size: 48px;
  font-weight: 400;
}
</style>
