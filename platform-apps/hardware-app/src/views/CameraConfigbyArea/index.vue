<template>
  <div class="camera-aera">
    <div class="camera-aera-content">
      <el-button type="primary"
                 class="confirm-btn"
                 @click="validateForm">
        保存
      </el-button>
      <configTable ref="inTable"
                   :data="inData"
                   title="入车策略配置"
                   @update="update"></configTable>
      <configTable ref="outTable"
                   :data="outData"
                   title="出车策略配置"
                   @update="update"></configTable>
      <configTable ref="passTable"
                   :data="passData"
                   title="过路车策略配置"
                   @update="update"></configTable>
      <configTable ref="passTable"
                   :data="unsureData"
                   title="坐席无法判断策略配置"
                   @update="update"></configTable>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/cameraConfigbyArea';
import configTable from './components/configTable';
export default {
  components: { configTable },
  data() {
    return {
      inData: [],
      outData: [],
      passData: [],
      unsureData: [],
      newInData: [],
      newOutData: [],
      newPassData: [],
      newUnsureData: []
    };
  },
  created() { },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      api
        .getData({
          parkId: this.$store.getters.userParkId // '1346766821899620353'
        })
        .then((res) => {
          console.log(res)
          const resData = res || [];
          resData.forEach((item) => {
            item.handleType = item.handleType + ''
            if (item.strategyType === 0) {
              //过路车策略
              this.passData.push(item);
            } else if (item.strategyType === 1) {
              //入车策略
              this.inData.push(item);
            } else if (item.strategyType === 2) {
              //出车策略
              this.outData.push(item);
            } else if (item.strategyType === 3) {
              //坐席无法判断策略
              this.unsureData.push(item);
            }
          });
        });
    },
    update(val, type) {
      //console.log(val, type);
      if (type == '0') {
        this.newPassData = val;
      } else if (type == '1') {
        this.newInData = val;
      } else if (type == '2') {
        this.newOutData = val;
      } else if (type == '3') {
        this.newUnsureData = val;
      }
    },
    validateForm() {
      let flag =
        this.$refs['inTable'].validateForm() &&
        this.$refs['outTable'].validateForm() &&
        this.$refs['passTable'].validateForm();
      if (flag) {
        this.updateHandel();
      } else {
        this.$message.error('输入验证失败！');
      }
    },
    updateHandel() {
      let params = [
        ...this.newInData,
        ...this.newOutData,
        ...this.newPassData,
        ...this.newUnsureData
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
.camera-aera {
  background-color: #fff;
  padding-top: 20px;
}
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
