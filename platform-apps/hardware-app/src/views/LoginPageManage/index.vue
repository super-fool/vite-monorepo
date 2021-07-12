<template>
  <div class="login-manage-wrapper">
    <el-form :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="manage-form">
      <el-form-item label="登录页文字:">
        <el-input v-model="configData.systemGroupName"
                  maxlength="6"
                  show-word-limit>
          <template slot="append">硬件云平台</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   style="width:150px"
                   @click="configUpdate">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '@/api/dic';
export default {
  data() {
    return {
      configData: {
        systemGroupName: ''
      },
      rules: {},
    };
  },
  created() { },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      api.getConfig().then((res) => {
        this.configData = res;
      });
    },
    configUpdate() {
      api.configUpdate(this.configData).then((res) => {
        this.$message.success('修改成功');
      });
    }
  },
};
</script>
<style scoped lang="less">
.login-manage-wrapper {
  box-sizing: border-box;
  height: 100%;
  background-color: #ffffff;
  padding: 30px;
  .manage-form {
    width: 400px;
  }
}
</style>
