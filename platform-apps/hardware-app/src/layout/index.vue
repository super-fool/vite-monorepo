<template>
  <div class="app-wrapper">
    <Header v-if="fullLayout" />
    <SideNav :menus="menus" />
    <!-- <Sidebar></Sidebar> -->
    <div class="main-container" :class="{ 'admin-box': isAdmin }">
      <!-- <div v-if="!isAdmin">
        <TagsView />
      </div> -->
      <AppMain />
    </div>
  </div>
</template>

<script>
// import TagsView from "./components/TagsView/index";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import AppMain from "./components/AppMain.vue";
import Header from "./header/Header.vue";
import SideNav from "./side-nav/SideNav.vue";
import { getMenuTree } from "@/api/menuManage";
// import * as vx from "vuex";

export default {
  data() {
    return {};
  },
  name: "Layout",
  components: {
    TagsView,
    Header,
    Sidebar,
    AppMain,
  },
  computed: {
    // ...vx.mapGetters(["isAdmin", "fullLayout"]),
  },
  created() {
    this.getMenus();
  },
  methods: {
    getMenus() {
      getMenuTree({
        parkId: this.userParkId,
      }).then((menus) => {
        menus.__proto__ === Array.prototype &&
          menus.forEach((menu) => {
            // N.B: 需要后端返回的数据结构中包含一个UID标识用来判断每一个menu
            const { menuName } = menu;
            switch (menuName) {
              case "高位相机":
                menu.icon = "xiangji1";
                break;
              case "坐席":
                menu.icon = "icon_location";
                break;
              case "NB地磁":
                menu.icon = "dici";
                break;
              case "视频桩":
                menu.icon = "icon-";
                break;
            }
          });
        this.menus = menus;
        this.$store.dispatch("menu/setMenus", menus);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.app-wrapper {
  height: 100%;
  overflow: hidden;
  background: #f2f6fa;
  display: flex;
  flex-direction: column;
}

.main-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px 20px 244px;
  background: #f4f6fc;
  overflow: hidden;
}
.admin-box {
  padding: 0 10px 20px 10px;
}
</style>
<style lang="less">
.admin-box {
  // margin-top: 20px;
  .app-main {
    display: flex;
    height: calc(100% - 20px);
  }
  .el-container {
    .el-main {
      padding: 0;
    }
    .el-aside {
      padding: 0;
      margin: 0 20px 0 0;
    }
  }
}
</style>
