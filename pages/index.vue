<template>
  <main>
    <form @submit.prevent="createEvent()">
      <input v-model="newEvent.name" placeholder="edit me">
      <input v-model="newEvent.when" placeholder="edit me">
      <input v-model="newEvent.where" placeholder="edit me">
      <input v-model="newEvent.description" placeholder="edit me">
      <button type="submit">Submit</button>
    </form>
    <ul>
      <loading-indicator v-if="$apollo.loading"/>
      <li v-for="event in events" v-else :key="event.id">
        <h1>{{ event.name }} <code>{{ event.id }}</code></h1>
        <p>{{ event.description }}</p>
        <button @click.prevent="deleteEvent(event.id)"><icon name="times-circle"/></button>
        
      </li>
    </ul>
  </main>
  
</template>

<script>
import uuid from "uuid/v1"
import loadingIndicator from "~/components/loadingIndicator"
import EVENT_CREATE from "./eventCreate.gql"
import EVENT_LIST from "./eventList.gql"
import EVENT_DELETE from "./eventDelete.gql"

export default {
  components: {
    loadingIndicator
  },
  data() {
    return {
      events: [],
      newEvent: {
        name: "",
        when: "",
        where: null,
        description: ""
      }
    }
  },
  methods: {
    createEvent() {
      const client = this.$apollo.getClient()
      const newEvent = this.newEvent
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
        console.error(e)
        this.newEvent = newEvent
      }
    },
    deleteEvent(eventId) {
      const client = this.$apollo.getClient()
      try {
        client.mutate({
          mutation: EVENT_DELETE,
          variables: { id: eventId },
          update: store => {
            let data = store.readQuery({ query: EVENT_LIST })
            let filteredData = data.listEvents.items.findIndex(event => event.id === eventId)
            if (filteredData !== -1) {
              data.listEvents.items.splice(filteredData, 1)
            }
            store.writeQuery({ query: EVENT_LIST, data })
          },
          optimisticResponse: {
            __typename: "Mutation",
            deleteEvent: {
              id: eventId,
              __typename: "Event"
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  },
  apollo: {
    events: {
      query: EVENT_LIST,
      update: data => {
        return data.listEvents.items
      }
    }
  }
}
</script>

<style>
.fa-icon {
  width: auto;
  height: 1em;
  color: red;
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
img {
  max-width: 400px;
}
ul {
  list-style: none;
  margin: 22px;
  padding: 0;
}
li {
  line-height: 200%;
}
code {
  font-size: 20px;
  color: gray(80);
}
</style>
