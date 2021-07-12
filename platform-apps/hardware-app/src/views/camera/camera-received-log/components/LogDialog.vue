<template>
  <el-dialog class="detail-dialog"
             title="接收日志内容"
             :visible.sync="dialogVisible"
             width="1120px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <div class="detail-dialog-content">
      {{this.dataStr}}
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dialogVisible: Boolean,
    dataStr: {
      type: String,
      default: ''
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    }
  }
};
</script>
<style scoped lang="less">
.detail-dialog {
  &-content {
    display: flex;
    &-left {
      width: 70%;
      padding-left: 20px;
    }
    &-right {
      width: 30%;
    }
  }
  &-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  &-part {
    display: flex;
    float: left;
    &-key {
      margin-bottom: 20px;
    }
  }
}
</style>
