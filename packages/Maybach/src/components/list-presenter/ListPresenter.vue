<template>
  <button @click="onIncrease">{{ count }}</button>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

interface IListPresenter {
  count: number;
}

@Component
class ListPresenter<IListPresenter> extends Vue {

  private count = 0;

  public onIncrease() {
    this.count++;
  }
}

export default ListPresenter;
</script>

<style>
</style>