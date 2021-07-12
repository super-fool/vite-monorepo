<template>
  <div class="st-container">
    <div
      class="fixed-menu"
      :class="{ active: hover }"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div v-for="(menu, index) in menus" :key="index" class="nav-container">
        <SvgIcon class="nav-icon" :icon="menu.icon" />
        <transition name="slide-fade">
          <menu-item v-if="hover" :menu="menu" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";
import MenuItem from "./MenuItem.vue";
export default {
  name: "Header",
  components: { SvgIcon, MenuItem },
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return { hover: false };
  },
};
</script>

<style scoped lang="less">
.slide-fade-leave-active {
  transition: all 0 cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.fixed-menu {
  background-color: #5994d0;
  position: fixed;
  top: 49px;
  min-width: 46px;
  padding-right: 8px;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  transition: min-width 0.3s cubic-bezier(0.24, 0.55, 0.51, 1.07);
}
.fixed-menu:hover {
  min-width: 160px;
}

.nav-container {
  color: #e2eae6;
  cursor: pointer;
  width: 100%;
  margin: 16px 0;
  display: flex;
  justify-content: flex-start;
  & > .nav-icon {
    height: 24px;
    width: 24px;
    margin: 0 10px;
  }
}

.st-container {
  position: relative;
  overflow: hidden;
  z-index: 10;
}
.st-menu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  visibility: hidden;
  width: 300px;
  height: 100%;
  background: #48a770;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
}

.st-menu::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  content: "";
  opacity: 1;
  -webkit-transition: opacity 0.5s;
  transition: opacity 0.5s;
}

.st-menu-open .st-menu::after {
  width: 0;
  height: 0;
  opacity: 0;
  -webkit-transition: opacity 0.5s, width 0.1s 0.5s, height 0.1s 0.5s;
  transition: opacity 0.5s, width 0.1s 0.5s, height 0.1s 0.5s;
}
.st-menu ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
}
.st-menu .logo {
  margin: 0;
  padding: 1em;
  color: rgba(0, 0, 0, 0.4);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  font-weight: 300;
  font-size: 2em;
}

.st-menu ul li a {
  display: block;
  padding: 1em 1em 1em 1.2em;
  outline: none;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.2);
  color: #f3efe0;
  text-transform: uppercase;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  letter-spacing: 1px;
  font-weight: 400;
  -webkit-transition: background 0.3s, box-shadow 0.3s;
  transition: background 0.3s, box-shadow 0.3s;
}

.st-menu ul li:first-child a {
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.2), inset 0 1px rgba(0, 0, 0, 0.2);
}

.st-menu ul li a:hover {
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0);
  color: #fff;
}

.st-effect-1.st-menu {
  visibility: visible;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}

.st-effect-1.st-menu-open .st-effect-1.st-menu {
  visibility: visible;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.st-effect-1.st-menu::after {
  display: none;
}
</style>