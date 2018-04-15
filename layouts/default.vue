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
