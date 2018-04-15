<template>
  <ol>
    <loading-indicator v-if="$apollo.loading"/>
    <li v-for="event in events" v-else :key="event.id">
      <mapbox :access-token="api"
              :map-options="{
                style: 'mapbox://styles/mapbox/light-v9',
                center: [5.1118473,52.0856266],
                zoom: 12
              }"
      />
      <h1>{{ event.name }}</h1>
      <time>When: {{ toDate(event.when) }}</time>
      <address>Address: {{ event.where }}</address>
      <p>{{ event.description }}</p>
      <delete-button @clicked="deleteEvent(event.id)">Delete</delete-button>  
      <delete-button @clicked="$router.push(`/${event.id}`)">more &#8614;</delete-button>  
    </li>
  </ol>
</template>

<script>
import { format } from "date-fns"
import loadingIndicator from "~/components/loadingIndicator"
import deleteButton from "~/components/deleteButton"
import mapbox from "mapbox-gl-vue"
import EVENT_LIST from "~/apollo/queries/eventList.gql"
import EVENT_DELETE from "~/apollo/mutations/eventDelete.gql"

export default {
  components: {
    loadingIndicator,
    deleteButton,
    mapbox
  },
  data() {
    return {
      events: [],
      api: process.env.MAPBOX_ACCESS_TOKEN
    }
  },
  methods: {
    toDate(dateString) {
      const n = Number(dateString)
      return format(n, "dddd")
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
      update: data => data.listEvents.items,
      error(error) {
        console.error("We've got an error!", error)
      }
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 200px;
}
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
