<template>
  <div class="error-page">
    <div class="error-code">
      <el-image :src="url" fit="fill"></el-image>
    </div>
    <div class="error-desc">访问的页面不存在</div>
    <!-- <div class="error-handle">
      <router-link to="/">
        <el-button type="primary">返回首页</el-button>
      </router-link>
      <el-button class="error-btn" type="primary" @click="goBack"
        >返回上一页</el-button
      >
    </div> -->
  </div>
</template>

<script>
import errorImg from '@/assets/image/404.png';
export default {
  data() {
    return {
      url: errorImg,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.error-page {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f3f3f3;
  padding-top: 40px;
  box-sizing: border-box;
}
.error-code {
  margin-top: 50px;
}
.el-image {
  width: 624px;
}
.error-desc {
  font-size: 18px;
  color: #777;
}
/* .error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn {
  margin-left: 100px;
} */
@media screen and (max-width: 1300px) {
  .error-code {
    margin: 0;
  }
  .el-image {
    width: 500px;
  }
}
</style>
