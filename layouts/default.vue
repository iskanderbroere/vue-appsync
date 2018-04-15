<template>
  <nuxt v-if="hydrated"/>
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
  font-size: 18px;
}
h1 {
  font-family: "EB Garamond", Georgia, Times, "Times New Roman", serif;
  font-size: 72px;
  font-weight: 400;
}
</style>
