<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews" :exclude="excludeArr">
        <router-view :key="key" v-if="isShow"></router-view>
      </keep-alive>
      <!-- <keep-alive :exclude="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive> -->
    </transition>
  </section>
</template>

<script>
import * as api from "@/api/dic";
export default {
  name: "AppMain",
  provide() {
    return {
      reload: this.reload,
      changeExcludeArr: this.changeExcludeArr,
    };
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.visitedViews.map((v) => {
        return v.meta.name;
      });
      // return "";
    },
    // notCachedViews() {
    //   return this.$store.state.tagsView.notCachedViews
    //   // return "";
    // },
    key() {
      return this.$route.path;
    },
  },
  data() {
    return {
      isShow: true,
      excludeArr: ["audit-list", "on-site-inspection", "audit-detail"],
    };
  },
  mounted() {
    api.getDic().then((res) => {
      if (res) {
        this.$store.dispatch("dic/setDicList", res);
      }
    });
  },
  methods: {
    reload() {
      this.isShow = false;
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
    changeExcludeArr(v, action) {
      if (action === "add") {
        this.excludeArr.push(v);
      } else if (action === "reduce") {
        this.excludeArr = this.excludeArr.filter((exclude) => {
          return exclude !== v;
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.app-main {
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
