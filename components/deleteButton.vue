<template>
  <button @click.prevent="clicked()"><slot/></button>
</template>

<script>
export default {
  methods: {
    clicked() {
      this.$emit("clicked")
    }
  }
}
</script>


<style scoped>
button {
  display: inline-flex;
  color: gray(35);
  background: gray(245);
  cursor: pointer;
  padding: 6px 12px;
  text-transform: uppercase;
  border: 2px solid gray(35);
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
  transition: color 0.2s, border 0.2s;
}
button:hover,
button:focus {
  background: transparent;
  border-color: red;
  color: red;
}
</style>
