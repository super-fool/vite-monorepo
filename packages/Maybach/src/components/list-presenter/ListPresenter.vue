<template>
  <div>
    <h2>Hi! {{ name }}</h2>
    <button @click="onIncrease">{{ count }}</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface IListPresenter {
  count: number;
}

@Component
class ListPresenter<IListPresenter> extends Vue {
  @Prop({ default: "hugo" }) name: string;

  private count = 0;

  public onIncrease() {
    this.count++;
  }
}

export default ListPresenter;
</script>

<style>
</style>