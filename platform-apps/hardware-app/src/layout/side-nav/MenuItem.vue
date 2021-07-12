<template>
  <div class="menu-item">
    <div class="menu-group" @click="onOpenSubItem">
      <span>{{ menu.menuName }}</span>
      <template v-if="menu.childMenus.length > 0">
        <SvgIcon
          v-if="!isCollapse"
          class="menu-item-icon"
          icon="jiantouarrow486"
        />
        <SvgIcon
          v-if="isCollapse"
          class="menu-item-icon"
          icon="jiantouarrow492"
        />
      </template>
    </div>
    <transition name="collapse-menus">
      <sub-menu-item
        v-if="isCollapse && menu.childMenus.length > 0"
        :subMenus="menu.childMenus"
      ></sub-menu-item>
    </transition>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";
import SubMenuItem from "./SubMenuItem.vue";
export default {
  naem: "MenuItem",
  components: { SvgIcon, SubMenuItem },
  props: {
    menu: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  mounted() {},
  methods: {
    onOpenSubItem() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.menu-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  & > .menu-group {
    width: 100%;
    display: flex;
  }
}
.menu-item-icon {
  height: 24px;
  width: 24px;
  position: absolute;
  right: 10px;
  flex: 1;
}

.collapse-menus-enter-active {
  transition: all 0.4s ease;
}
.collapse-menus-leave-active {
  transition: all 0.4s ease;
}
.collapse-menus-enter,
.collapse-menus-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>