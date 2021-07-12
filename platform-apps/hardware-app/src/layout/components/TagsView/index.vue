<template>
  <div id="tags-view-container"
       class="tags-view-container">
    <scroll-pane ref="scrollPane"
                 class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews"
                   ref="tag"
                   :key="tag.path"
                   :class="isActive(tag) ? 'active' : ''"
                   :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                   class="tags-view-item">
        <span>{{ tag.title }}</span>
        <span class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import * as vx from "vuex";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      selectedTag: {},
      affixTags: []
    };
  },
  computed: {
    ...vx.mapGetters(["visitedViews"])
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    initTags() { },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addVisitedView", this.$route);
      }
      return false;
    },
    closeSelectedTag(view) {
      this.$store.dispatch("tagsView/delVisitedView", view);
			// if(view.path === '/CameraStatusList'){
			// 	if(window.localStorage){
			// 		localStorage.removeItem('CameraStatusListPage')
			// 	}
			// }
      // .then(({ visitedViews }) => {
      //   if (this.isActive(view)) {
      //     //this.toLastView(visitedViews, view);
      //   }
      // });
    },
    toLastView(visitedViews, view) {
      console.log(visitedViews);
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        this.$router.push("/");
      }
    },
    moveToCurrentTag() {
      this.$nextTick(() => {
        const tags = this.$refs.tag || [];
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            break;
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.tags-view-container {
  width: 100%;
  height: 40px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  background: #e8ecf0;
  border-radius: 2px;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
      }
    }
  }
}
</style>
<style lang="less">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      box-sizing: border-box;
      padding-left: 2px;
      margin-left: 3px;
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
