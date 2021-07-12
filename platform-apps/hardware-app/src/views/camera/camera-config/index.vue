<template>
  <div class="view">
    <header class="view-header pb-24">
      <el-button type="primary"
                 class="confirm-btn"
                 @click="validateForm">
        保存
      </el-button>
      <el-form>
        <el-form-item label="巡检状态自动更新周期">
          <el-input-number v-model="autoRefesh.configValue"
                           controls-position="right"
                           step-strictly
                           :min="0.5"
                           :max="48"
                           :step="0.5"></el-input-number>
          小时
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content">

      <configTable ref="configDataRef"
                   :data="configData"
                   title="相机巡检策略配置"
                   @update="update"></configTable>

    </div>
  </div>
</template>

<script>
import * as api from '@/api/cameraAuditConfig';
import configTable from './components/configTable';
export default {
  components: { configTable },
  data() {
    return {
      configData: [],
      autoRefesh: {}
    };
  },
  created() { },
  mounted() {
    this.searchData();
  },
  methods: {
    searchData() {
      api
        .getData({
          parkId: this.$store.getters.userParkId // '1346766821899620353'
          // parkId: '1370980801742770177'
        })
        .then((res) => {
          // this.configData = res
          res.forEach(item => {
            item.handleType = item.handleType + ''
            if (item.strategyCode == 12) {
              this.autoRefesh = item
            } else {
              this.configData.push(item)
            }
          })
        });
    },
    update(val) {
      this.configData = val
    },
    validateForm() {
      let flag =
        this.$refs['configDataRef'].validateForm()
      if (flag) {
        this.updateHandel();
      } else {
        this.$message.error('输入验证失败！');
      }
    },
    updateHandel() {
      let params = [
        this.autoRefesh,
        ...this.configData
      ];
      console.log(params);
      if (params.length == 0) {
        this.$message.warning('无修改数据');
        return false;
      }
      api.updateData(params).then(() => {
        this.$message.success('配置保存成功');
      });
    }
  }
};
</script>
<style scoped lang="less">
.confirm-btn {
  width: 120px;
  margin: 10px;
}
.config-til {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  height: 35px;
  line-height: 35px;
}
</style>
