<template>
  <div class="tab-container">
    <div class="keytop-logo">
      <span>硬件云平台</span>
      <span class="search-separate"></span>
    </div>
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
        <input class="search-input" placeholder="您需要什么, 请告诉我" />
        <span class="search-separate"></span>
        <SvgIcon class="search-icon" icon="icon-chaxun" />
      </div>
      <el-popover
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
import SvgIcon from "@/components/SvgIcon";

import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  components: { SvgIcon },
})
@Component
class SideNav extends Vue {
  private activeRouteName: String;

  @Watch("$route")
  onRouteChange(newRoute: ) {
    const { name } = newRoute;
    this.activeRouteName = name;
  }

  openActiveRoute(component) {
    console.log(component);
    this.$router.replace({ name: component.name });
  }

  getRouteComponents() {
    const components = [];
    this.$store.state.naviStacks.stacks.forEach((val) =>
      components.push(val[val.length - 1])
    );
    return components;
  }
}

export default SideNav;
</script>

<style lang="less" scoped>
.tab-container {
  background: #fff;
  height: 48px;
  overflow: hidden;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  margin-bottom: 16px;
  box-shadow: 0 2px 5px 1px #95c9fd;
}
.keytop-logo {
  height: 100%;
  display: flex;
  align-items: center;
  & > span {
    margin: auto 8px;
  }
}
.tab-nav-region {
  flex: 1;
  display: flex;
  flex-direction: row;
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
  & .tab-info-search {
    height: 28px;
    flex: 1;
    display: flex;
    align-items: center;
    border: 1px solid #b4bccc;
    border-radius: 16px;
    margin-right: 16px;
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