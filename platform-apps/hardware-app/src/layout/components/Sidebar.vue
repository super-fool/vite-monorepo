<template>
  <div class="sidebar">
    <div class="logo" v-if="fullLayout">硬件云平台</div>
    <el-menu
      v-if="!isAdmin"
      class="sidebar-el-menu"
      :collapse="collapse"
      background-color="#22293B"
      text-color="#FFFFFF"
      active-text-color="#1890ff"
      unique-opened
      router
    >
      <template v-for="item in menuData">
        <template v-if="item.childMenus">
          <el-submenu :index="item.id" :key="item.id">
            <template slot="title">
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <template v-for="subItem in item.childMenus">
              <el-submenu
                v-if="subItem.childMenus"
                :index="subItem.id"
                :key="subItem.id"
              >
                <template slot="title">{{ subItem.menuName }}</template>
                <el-menu-item
                  v-for="threeItem in subItem.childMenus"
                  :key="threeItem.id"
                  :index="threeItem.componentName"
                  >{{ threeItem.menuName }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.componentName"
                :key="subItem.id"
                >{{ subItem.menuName }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.componentName" :key="item.id">
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import * as vx from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      collapse: false,
    };
  },
  computed: {
    ...vx.mapGetters(["isAdmin", "menuData", "fullLayout"]),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  .logo {
    width: 220px;
    text-align: center;
    line-height: 64px;
    font-size: 18px;
    color: #ffffff;
    background-color: #293147;
  }
  .sidebar-el-menu {
    height: calc(100% - 64px);
    overflow-y: auto;
  }
}

.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar > ul {
  height: 100%;
}
</style>
<style>
.sidebar .el-menu .is-active {
  background-color: rgb(20, 26, 38) !important;
}
</style>
