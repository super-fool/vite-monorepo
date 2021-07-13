<template>
  <div class="tab-container">
    <span class="keytop-logo"> 硬件云平台 </span>
    <ul class="tab-nav-region">
      <li
        v-for="({ component, name }, index) in naviStacks"
        :key="index"
        class="tab-title"
        :class="{ active: name === activeRouteName }"
        @click="openActiveRoute(component)"
      >
        {{ component.meta.title }}
        <SvgIcon class="tab-close" icon="guanbi1" />
      </li>
    </ul>
    <div class="tab-info-region">
      <div class="tab-info-search">
        <input class="search-input" placeholder="请选择车场" />
        <span class="search-separate"></span>
        <SvgIcon class="search-icon" icon="jiantou1" />
      </div>
      <el-popover
        class="tab-info-tip"
        placement="top-start"
        title="标题"
        width="200"
        trigger="hover"
        content="在线客服 ???"
      >
        <div slot="reference" class="hello">
          <SvgIcon class="yiwen" icon="yiwen" />
        </div>
      </el-popover>
      <div class="avator">avator</div>
    </div>
  </div>
</template>

<script lang="ts">
import SvgIcon from "../../svg-icon/SvgIcon.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
@Component({
  components: { SvgIcon },
})
class SideNav extends Vue {

  private activeRouteName: string | null | undefined = "";
  private route: Route = null;
  private naviStacks: any = this.$store.state.naviStacks;

  constructor() {
    super();
    console.log(this.$route);
    console.log(this.$store);
    this.route = this.$route;
  }

  @Watch("route")
  onRouteChange(newRoute: Route) {
    const { name } = newRoute;
    this.activeRouteName = name;
  }

  openActiveRoute(component) {
    this.$router.replace({ name: component.name });
  }

  getRouteComponents() {
    const components = [];
    naviStacks.stacks.forEach((val) => components.push(val[val.length - 1]));
    return components;
  }
}

export default SideNav;
</script>

<style lang="less" scoped>
.tab-container {
  background-color: #0074ff;
  height: 64px;
  overflow: hidden;
  display: flex;
  margin-bottom: 16px;
  box-shadow: 0 2px 5px 1px #0074ff;
}
.keytop-logo {
  color: #ffffff;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 24px;
  margin-left: 24px;
  height: 100%;
  display: flex;
  align-items: center;
}
.tab-nav-region {
  flex: 1;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  margin: 12px 20px;
  border-radius: 4px;
  align-items: flex-end;
  & > .tab-title {
    cursor: pointer;
    font-size: 14px;
    padding: 6px 12px;
    color: #7cb8f5;
    border-top-left-radius: 8px;
    margin-right: 2px;
    border-top-right-radius: 20px;
    border: 1px solid #7cb8f5;
    border-bottom: none;
    & > .tab-close {
      height: 12px;
      font-weight: bold;
    }
  }
  & > .active {
    background-color: #7cb8f5;
    color: #ffffff;
  }
}
.tab-info-region {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 12px;
  min-width: 400px;
  & .tab-info-search {
    background-color: #ffffff;
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 100%;
    & .search-input {
      margin-left: 16px;
      outline-style: none;
      flex: 1;
      border: none;
      overflow: visible;
      background: transparent;
      box-shadow: none;
    }
    & .search-icon {
      height: 20px;
      margin: auto 12px;
      widows: 20px;
      color: #409eff;
    }
  }
  & .tab-info-tip {
    margin: 0 40px
  }
}
.search-separate {
  border-left: 1px solid #dfe1e5;
  height: 65%;
}
.avator {
  border-radius: 50%;
  margin-right: 16px;
}
.yiwen {
  height: 22px;
  width: 22px;
  margin-right: 16px;
}
</style>