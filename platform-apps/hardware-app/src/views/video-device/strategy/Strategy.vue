<template>
  <div class="camera-aera">
    <div class="camera-aera-content">
      <el-button type="primary" class="confirm-btn" @click="validateForm">
        保存
      </el-button>
      <el-button type="primary" class="confirm-btn" @click="resetForm">
        恢复默认配置
      </el-button>
      <configTable
        ref="inTable"
        :data="inData"
        title="入车策略配置"
        @update="update"
      ></configTable>
      <configTable
        ref="outTable"
        :data="outData"
        title="出车策略配置"
        @update="update"
      ></configTable>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import configTable from "./components/configTable";
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
      newUnsureData: [],
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * 恢复默认值
     */
    resetForm() {
      this.getList(true);
    },
    getList(resetType = false) {
      const parkId = this.$store.getters.userParkId;
      const param = resetType
        ? {
            url: "/manage/manage/parkcamerastrategy/lowVideoStrategyInit",
            params: {
              parkId,
              configType: 3,
            },
          }
        : {
            url: "/manage/manage/parkcamerastrategy/listLowVideoStrategy",
            params: {
              parkId,
            },
          };
      request({
        method: "get",
        ...param,
      }).then((res) => {
        const resData = res || [];
        const inData = [],
          outData = [];
        resData.forEach((item) => {
          item.handleType = item.handleType + "";
          if (item.strategyType === 1) {
            //入车策略
            inData.push(item);
          } else if (item.strategyType === 2) {
            //出车策略
            outData.push(item);
          }
        });
        this.inData = inData;
        this.outData = outData;
      });
    },
    update(val, type) {
      //console.log(val, type);
      if (type == "0") {
        this.newPassData = val;
      } else if (type == "1") {
        this.newInData = val;
      } else if (type == "2") {
        this.newOutData = val;
      } else if (type == "3") {
        this.newUnsureData = val;
      }
    },
    validateForm() {
      let flag =
        this.$refs["inTable"].validateForm() &&
        this.$refs["outTable"].validateForm();
      if (flag) {
        this.updateHandel();
      } else {
        this.$message.error("输入验证失败！");
      }
    },
    updateHandel() {
      let params = [
        ...this.newInData,
        ...this.newOutData,
        ...this.newPassData,
        ...this.newUnsureData,
      ];
      console.log(params);
      if (params.length == 0) {
        this.$message.warning("无修改数据");
        return false;
      }
      request({
        url: "/manage/manage/parkcamerastrategy/update",
        method: "post",
        data: params,
      }).then(() => {
        this.$message.success("配置保存成功");
      });
    },
  },
};
</script>
<style scoped lang="less">
.camera-aera-content {
  padding: 10px 0;
}
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
