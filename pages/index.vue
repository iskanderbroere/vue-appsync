<template>
  <ul>
    <loading-indicator v-if="$apollo.loading"/>
    <li v-for="car in allCars" :key="car.id">
      <h1>{{ `${car.make} - ${car.model} - ${car.year}` }}</h1>
      <img :src="car.photoURL" :alt="car.make">
      <button @click.prevent="getEnv()">Getenv</button>
    </li>
  </ul>
</template>

<script>
import gql from "graphql-tag"
import loadingIndicator from "~/components/loadingIndicator"

export default {
  components: {
    loadingIndicator
  },
  data() {
    return {
      allCars: [],
      envv: process.env.endpoint
    }
  },
  methods: {
    getEnv() {
      console.log(process)
      console.log(process.env.endpoint)
    }
  },
  apollo: {
    allCars: {
      query: gql`
        {
          allCars {
            id
            make
            model
            year
            photoURL
          }
        }
      `
    }
  }
}
</script>

<style>
body {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  color: gray(35);
  font-size: 18px;
}
h1 {
  font-size: 2rem;
  font-weight: 300;
  text-shadow: 2px 2px gray(200);
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
</style>
