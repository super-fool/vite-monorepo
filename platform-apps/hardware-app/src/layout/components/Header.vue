<template>
  <div class="header">
    <div>
      <el-menu v-if="isAdmin"
               :default-active="activeNav"
               class="nav-menu"
               mode="horizontal"
               @select="navSelect">
        <el-menu-item index="MenuManage">菜单管理</el-menu-item>
        <el-menu-item index="ParkingLotManage">车场管理</el-menu-item>
        <el-menu-item index="RoleManage">角色管理</el-menu-item>
        <el-menu-item index="UserManage">用户管理</el-menu-item>
        <el-menu-item index="PlatformManage">收费系统平台管理</el-menu-item>
        <el-menu-item index="LoginPageManage">登录页管理</el-menu-item>
      </el-menu>
      <el-menu v-else
               :default-active="activeMenu"
               class="nav-menu"
               mode="horizontal"
               @select="sideMenuSelect">
        <el-menu-item :index="item.id"
                      :key="item.id"
                      @click.native="getSecMenuData(item)"
                      v-for="item in menuData">
          {{ item.menuName }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
      <div class="header-park-lot"
           v-if="!isAdmin">
        <el-select v-model="parkLotId"
                   filterable
                   placeholder="请选择"
                   @change="parkLotChange">
          <el-option v-for="item in parkLotOptions"
                     :key="item.id"
                     :label="item.parkName"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="header-user-con">
        <el-dropdown class="user-name"
                     trigger="click">
          <span class="el-dropdown-link"
                v-if="userInfo">
            {{ userInfo.nickname }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="passwordChange">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided
                              @click.native="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <PwdChangeDialog :dialogVisible.sync="pwdChangeVisible"
                     v-if="pwdChangeVisible"></PwdChangeDialog>
  </div>
</template>
<script>
import * as vx from 'vuex';
import { getUserParking, selectParking, logout } from '@/api/login';
import { getMenuTree } from '@/api/menuManage';
import PwdChangeDialog from '@/components/PwdChangeDialog';

export default {
  components: { PwdChangeDialog },
  data() {
    return {
      parkLotOptions: [],
      parkLotId: '',
      activeNav: '',
      pwdChangeVisible: false,
      activeMenu: '',
      menuData: [],
    };
  },
  computed: {
    ...vx.mapGetters(['isAdmin', 'userInfo', 'userParkId', 'menuId']),
  },
  mounted() {
    this.activeNav = this.$route.name;
    if (!this.isAdmin) {
      this.getUserParking();
      this.getMenuTree();
      this.activeMenu = this.menuId ? this.menuId : '';
    }
  },
  methods: {
    getMenuTree() {
      getMenuTree({
        parkId: this.userParkId,
      }).then((data) => {
        this.menuData = data;
        const menuIdArr = this.menuData.map((item) => item.id);
        if (this.activeMenu && menuIdArr.includes(this.activeMenu)) {
          this.menuData.forEach((item) => {
            if (item.id === this.activeMenu) {
              this.getSecMenuData(item);
            }
          });
        } else {
          this.getSecMenuData(this.menuData[0]);
          this.activeMenu = this.menuData[0].id;
          this.sideMenuSelect(this.activeMenu);
          // this.$router.replace(
          //   `/${this.menuData[0].childMenus[0].componentName}`
          // );
        }
      });
    },
    sideMenuSelect(val) {
      this.$store.dispatch('menu/setMenuId', val);
    },
    getSecMenuData(data) {
      this.$store.dispatch('menu/setSideMenu', data.childMenus);
    },
    getUserParking() {
      getUserParking().then((data) => {
        const { parkings } = data;
        this.parkLotOptions = parkings;
        this.parkLotId = this.userParkId;
      });
    },
    parkLotChange(val) {
      selectParking({
        parkId: this.parkLotId,
      }).then(() => {
        this.saveParkLot(val);
      });
    },
    saveParkLot(id) {
      let item = this.parkLotOptions.filter((v) => v.id === id);
      this.$store.dispatch('user/setParkLot', item[0]);
    },
    logout() {
      logout().then(() => {
        this.$router.replace({name: 'Login'});
        this.$store.dispatch('user/logout');
        this.$store.dispatch('menu/removeMenu');
        this.$store.dispatch('tagsView/removeVisitedView');
      });
    },
    passwordChange() {
      this.pwdChangeVisible = true;
    },
    navSelect(val) {
      this.$router.push('/' + val);
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  // position: absolute;
  // top: 0;
  // left: 220px;
  // right: 0;
  padding-left: 220px;
  box-sizing: border-box;
  min-width: 850px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  color: #fff;
  background-color: #293147;
  .header-right {
    display: flex;
    align-items: center;
  }
  .header-user-con {
    margin: 0 50px;
    cursor: pointer;
  }
}
</style>
<style>
.header-park-lot .el-select .el-input__inner {
  border: 1px solid #1890ff;
}
.header .nav-menu {
  color: #ffffff;
  background-color: #293147;
}
.header .el-menu.el-menu--horizontal {
  border: 0;
}
.header .el-menu--horizontal > .el-menu-item {
  height: 64px;
  line-height: 64px;
  color: #ffffff !important;
}
.header .el-menu--horizontal .el-menu-item:not(.is-disable):hover {
  background-color: #1b2130;
}
.header .el-menu--horizontal .el-menu-item:not(.is-active):hover {
  color: #ffffff;
  background-color: #1b2130;
}
.header .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
  background-color: #1890ff;
}
.header .el-menu--horizontal > .el-menu-item.is-active {
  border: 0;
  color: #ffffff;
  background-color: #1890ff;
}
.header .el-select .el-input .el-input__inner {
  color: rgba(255, 255, 255, 0.65);
  background-color: #303a54;
}
.header .header-user-con .el-dropdown-link {
  color: #ffffff;
}
</style>
