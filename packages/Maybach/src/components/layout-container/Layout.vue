<template>
  <div class="app-wrapper">
    <!-- <Header />
    <SideNav :menus="menus" /> -->
    <div class="main-container" :class="{ 'admin-box': isAdmin }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { VueClass } from "vue-class-component/lib/declarations";
import { Vue, Component, Prop } from "vue-property-decorator";

// import Header from "./header/Header.vue";
// import SideNav from "./side-nav/SideNav.vue";

@Component({
  components: {
    Header,
    SideNav,
  },
})
class Layout extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop(Array) readonly menus!: any[];
  @Prop(Boolean) readonly isAdmin: Boolean;
  @Prop(String) readonly userParkId: String;
  @Prop(Number) readonly fullLayout: 0 | 1;
}

export default Layout;
</script>

<style lang="less">
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
}
</style>
