<template>
  <div class="app-wrapper">
    <Header />
    <SideNav :menus="menuData" />
    <div class="main-container" :class="{ 'admin-box': isAdmin }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Header from "./header/Header.vue";
import SideNav from "./side-nav/SideNav.vue";

@Component({
  components: {
    Header,
    SideNav,
  },
})
class Layout extends Vue {
  @Prop(Array) readonly menus!: any[];
  @Prop(Boolean) readonly isAdmin: boolean = false;
  @Prop(String) readonly userParkId!: string;
  @Prop(Boolean) readonly fullLayout: boolean = false;

  get parkId() {
    return this.userParkId;
  }

  get menuData() {
    console.log(this.menus);
    return this.menus;
  }
}

export default Layout;
</script>

<style lang="less" scoped>
.app-wrapper {
  height: 100%;
  overflow: hidden;
  background: #f2f6fa;
  display: flex;
  flex-direction: column;
}
.app-logo {
  width: 56px;
  height: 40px;
  color: black;
  position: fixed;
  background: black;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.main-container {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  background: #f2f6fa;
  overflow: hidden;
  flex-direction: column;
  margin-left: 46px;
  padding: 0 12px;
}
</style>