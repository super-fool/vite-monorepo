<template>
  <ul class="sub-menu">
    <li
      v-for="({ menuName, componentName }, index) in subMenus"
      :key="index"
      class="sub-menu-item"
      @click="pushRoute(componentName)"
    >
      {{ menuName }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "SubMenuItem",
  props: {
    subMenus: {
      type: Array,
      required: true,
    },
  },
  mounted() {},
  methods: {
    pushRoute(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style lang="less" scoped>
.sub-menu {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  & > &-item {
    margin-top: 16px;
  }
  & > &-item:hover {
    color: aqua;
  }
}
</style>