<template>
  <div class="toobar">
    <slot name="toolBar"></slot>
  </div>
</template>
<script>
export default {
  name: "ToolBar",
  props: {
    toolBar: {
      type: Array,
    },
    query: {
      type: Function,
    },
    onAdd: {
      type: Function,
    },
    batchDelete: {
      type: Function,
    },
    export: {
      type: Object,
    },
    queryFields: {
      type: Array,
    },
  },
};
</script>

<style scoped lang="less">
.toobar {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  margin: 8px 0;
  & > .btn {
    margin-right: 15px;
    padding: 8px 11px;
  }
}
</style>