<template>
  <div class="app">
    <aside><h1>BONAS</h1><icon scale="3" name="adjust"/></aside>
    <main><nuxt v-if="hydrated"/></main>
  </div>
</template>

<script>
export default {
  data: () => ({ hydrated: false }),
  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated()
    this.hydrated = true
  }
}
</script>

<style>
.app {
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-gap: 50px;
}
aside {
  display: flex;
  flex-direction: column;
}
aside {
  padding: 50px 0 50px 50px;
}
main {
  padding: 50px 50px 50px 0;
}
.app aside h1 {
  font-size: 122px;
}
.fa-icon {
  width: auto;
  height: 1em;
  /* old Safari */
  max-width: 100%;
  max-height: 100%;
}
body {
  font-family: "Karla", sans-serif;
  font-weight: 400;
  color: gray(35);
  font-size: 18px;
}
h1 {
  font-family: "EB Garamond", Georgia, Times, "Times New Roman", serif;
  font-size: 72px;
  font-weight: 400;
}
input {
  display: flex;
  margin-bottom: 10px;
  padding: 5px 8px;
  appearance: none;
  border: 1px solid #cad0d2;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
