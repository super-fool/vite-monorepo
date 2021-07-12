<template>
  <div class="img-box">
    <div class="img-box-container">
      <img class="img-box-container-detail"
           ref="img"
           name="removeImg"
           :src="imgSrc"
           v-drag
           v-show="imgSrc.length"
           @mousewheel="rollImg(this)">
      <span v-show="!imgSrc.length"
            class="none-text">暂无图片</span>
    </div>
    <div class="img-box-time"
         v-if="time">{{time}}</div>
    <!-- <img class="img-box-detail"
         ref="img"
         name="removeImg"
         :src="imgSrc"
         v-drag
         @mousewheel="rollImg(this)"
         :style="scaleFun"> -->
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // imgSrc: this.imgUrl,//图片的路径
    }
  },
  directives: {//注册指令
    drag: function(el) {
      let dragBox = el; //获取当前元素
      dragBox.onmousedown = e => {
        e.preventDefault();
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        document.onmousemove = e => {
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          e.preventDefault();
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //移动当前元素
          dragBox.style.left = left + "px";
          dragBox.style.top = top + "px";
        };
        document.onmouseup = e => {
          e.preventDefault();
          //鼠标弹起来的时候不再移动
          document.onmousemove = null;
          //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
          document.onmouseup = null;
        };
      }
    }
  },
  // watch: {
  //   config: {
  //     deep: true,
  //     immediate: true,
  //     handler(val) {
  //       this.imgsrc = val.imgsrc
  //       console.log(this.imgsrc)
  //     }
  //   }
  // },
  computed: {
    scaleFun: function() {
      return `transform:scale(${this.config.scale})`
    },
    imgSrc() {
      return this.imgUrl
    }
  },
  mounted() {
    this.$refs.img.onload = function() {
      if (this.height > this.width) {
        this.classList.add("h-100")
      } else {
        this.classList.add("w-100")
      }
    }

  },
  methods: {
    handleScroll(e) {
      // e.deltaY>0?'down':'up'
      console.log(e.deltaY)
    },
    rollImg() {
      /* 获取当前页面的缩放比
            若未设置zoom缩放比，则为默认100%，即1，原图大小
        */
      // var zoom = parseInt(this.$refs.img.style.zoom) || 100;
      // /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
      //       wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
      //   */
      // zoom += event.wheelDelta / 12;
      // /* 最小范围 和 最大范围 的图片缩放尺度 */
      // if (zoom >= 50 && zoom < 250) {
      //   this.$refs.img.style.zoom = zoom + "%";
      // }
      var str = this.$refs.img.style.cssText
      var zoom
      if (!str) {
        zoom = 1
      } else {
        zoom = Number.parseFloat(str.match(/\d+(.\d+)?/g)[0])
      }
      /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
            wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
        */
      zoom += event.wheelDelta / 1200;
      /* 最小范围 和 最大范围 的图片缩放尺度 */
      if (zoom >= 0.8 && zoom < 6) {
        this.$refs.img.style.transform = `scale(${zoom})`;
      }
      return false;
    }
  },
}
</script>

<style lang="less" scoped>
.img-box {
  background-color: #000;
  &-container {
    height: 555px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    &-detail {
      position: absolute;
      // height: 555px;
      // width: 100%;
      // height: 90%;
      // object-fit: contain;
      margin: 0 auto;
    }
  }
  &-time {
    line-height: 30px;
    font-size: 14px;
    color: #595959;
    text-align: center;
  }
  .none-text {
    color: grey;
  }
  .w-100 {
    width: 100%;
  }
  .h-100 {
    height: 100%;
  }
}
</style>