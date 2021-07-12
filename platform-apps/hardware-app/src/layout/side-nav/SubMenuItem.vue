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
  margin-left: -20px;
  font-size: 14px;
  & > &-item {
    margin: 16px 0;
  }
  & > &-item:hover {
    color: aqua;
  }
}
</style>