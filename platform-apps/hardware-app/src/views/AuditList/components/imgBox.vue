<template>
  <div class="img-box">
    <img class="img-box-detail"
         ref="img"
         name="removeImg"
         :src="imgSrc"
         v-drag
         @mousewheel="rollImg(this)">
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
    }
  },
  data() {
    return {
      // imgSrc: this.imgUrl,//图片的路径
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
  created() { },
  methods: {
    handleScroll(e) {
      // e.deltaY>0?'down':'up'
      console.log(e.deltaY)
    },
    rollImg() {
      /* 获取当前页面的缩放比
            若未设置zoom缩放比，则为默认100%，即1，原图大小
        */
      var zoom = parseInt(this.$refs.img.style.zoom) || 100;
      /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
            wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
        */
      zoom += event.wheelDelta / 12;
      /* 最小范围 和 最大范围 的图片缩放尺度 */
      if (zoom >= 100 && zoom < 250) {
        this.$refs.img.style.zoom = zoom + "%";
      }
      return false;
    }
  },
}
</script>

<style lang="less" scoped>
.img-box {
  height: 555px;
  overflow: hidden;
  position: relative;
  background-color: #000;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  &-detail {
    position: absolute;
    height: 555px;
    object-fit: contain;
    margin: 0 auto;
  }
}
</style>