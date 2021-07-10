<template>
  <ListPresenter />
</template>

<script lang="ts">
import { ListPresenter } from "@maybach/components";
export default {
  name: "App",
  components: { ListPresenter },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
