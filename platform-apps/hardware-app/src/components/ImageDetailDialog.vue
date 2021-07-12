<template>
  <el-dialog
    class="view-dialog"
    title="照片"
    :visible.sync="dialogVisible"
    width="520px"
    :before-close="handleClose"
  >
    <el-carousel
      indicator-position="outside"
      :autoplay="false"
      @change="changeImg"
      :arrow="arrow"
      v-if="dialogVisible"
    >
      <el-carousel-item v-for="(item, index) in dataItem" :key="index">
        <div class="img-dec">
          <div class="img-dec-text">
            <span>{{ mappingDic("ImageUrlType", item.urlType) }}</span>
            <span> {{ mappingDic("ImageType", item.imageType) }}</span>
          </div>
          <div>{{ index + 1 }}/{{ dataItem.length }}</div>
          <div></div>
        </div>
        <el-image
          :src="item.imageUrl"
          ref="elImage"
          fit="scale-down"
          :style="imageStyle"
          :preview-src-list="urlList"
          @click="showPreviewImg"
        >
        </el-image>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="none-data">
      <img src="@/assets/image/none-data@3x.png" />
      <p>暂无图片</p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      arrow: "hover",
      imageStyle: {
        margin: "20px auto",
        height: "100%",
        display: "flex",
      },
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    dialogVisible(val) {
      val &&
        this.$nextTick(() => {
          this.changeImg(0);
        });
    },
  },
  filters: {
    // getSourceType(v) {
    //   let text = '';
    //   switch (v) {
    //     case 0:
    //       text = 'pos机';
    //       break;
    //     case 1:
    //       text = '高位相机';
    //       break;
    //     case 2:
    //       text = 'web端';
    //       break;
    //     default:
    //       text = '-';
    //       break;
    //   }
    //   return text;
    // }
  },
  computed: {
    urlList: function () {
      return this.dataItem.map((val) => val.imageUrl);
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    changeImg(e) {
      setTimeout(() => {
        const carousel = document.getElementsByClassName("el-carousel__item");
        if (carousel && carousel[e]) {
          carousel[e].removeAttribute("style");
        }
      }, 1);
    },
    showPreviewImg() {
      this.arrow = "never";
      this.$nextTick(() => {
        const imageViewer = document.getElementsByClassName(
          "el-image-viewer__close"
        );
        if (imageViewer && imageViewer[0]) {
          imageViewer[0].addEventListener("click", () => {
            this.arrow = "hover";
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.none-data {
  text-align: center;
  padding: 30px 0 50px;
  & img {
    width: 60px;
    margin: 10px auto;
  }
}
.img-dec {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  .img-dec-text {
    font-weight: bold;
  }
}
</style>
<style>
.view-dialog .el-carousel__container {
  height: 600px;
}
</style>
