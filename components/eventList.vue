<template>
  <ol>
    <loading-indicator v-if="$apollo.loading"/>
    <li v-for="event in events" v-else :key="event.id">
      <h1>{{ event.name }} <code>{{ event.when }}</code></h1>
      <address>Address: {{ event.where }}</address>
      <p>{{ event.description }}</p>
      <delete-button @clicked="deleteEvent(event.id)"/>  
    </li>
  </ol>
</template>

<script>
import loadingIndicator from "~/components/loadingIndicator"
import deleteButton from "~/components/deleteButton"
import EVENT_LIST from "~/apollo/queries/eventList"
import EVENT_DELETE from "~/apollo/mutations/eventDelete"

export default {
  components: {
    loadingIndicator,
    deleteButton
  },
  data() {
    return {
      events: []
    }
  },
  methods: {
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
      },
      error(error) {
        console.error("We've got an error!", error)
      }
    }
  }
}
</script>

<style scoped>
ol {
  list-style: none;
  margin: 22px;
  padding: 0;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
li {
  padding: 25px;
  border: 2px solid black;
}
code {
  font-size: 18px;
  color: gray(110);
}
address {
  font-size: 18px;
  font-style: italic;
  color: gray(110);
}
</style>
