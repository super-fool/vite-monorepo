<template>
  <el-dialog
    class="hight-dialog"
    title="添加低位相机桩"
    :visible.sync="showDialog"
    width="800px"
    :before-close="onClose"
  >
    <div class="camera-list">
      <el-form :inline="true">
        <el-form-item label="设备编号：">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="onQuery"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="records"
          ref="multipleTable"
          class="camera-table"
          @select="onSelectRow"
          @select-all="onSelectRow"
          :header-cell-style="{
            background: '#f5f5f5',
            'line-height': '36px',
          }"
          style="width: 100%"
        >
          <el-table-column type="selection" width="70"> </el-table-column>
          <el-table-column prop="cameraType" label="品牌" min-width="100">
            <template slot-scope="scope">
              {{ mappingDic("DeviceBrand", scope.row.deviceBrand) }}
            </template>
          </el-table-column>
          <el-table-column prop="deviceCode" label="设备编号" min-width="170">
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        small
        layout="prev, pager, next"
        :page-size="queryParams.size"
        :current-page.sync="queryParams.current"
        :total="totalCount"
        @current-change="onTurnPage"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="view-dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onAdd" :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import * as vx from "vuex";
import request from "@/utils/request";
export default {
  name: "AddLowCameraDialog",
  data() {
    return {
      loading: false,
      cameraPattern: "1",
      cameraPatternList: [],
      rules: {},
      queryParams: {
        deviceCode: "",
        current: 1,
        size: 5,
      },
      records: [],
      totalCount: 0,
      selectObj: {},
      selectedDeviceCode: [], // 记录勾选数据缓存数组
      cancelSelectObj: {},
    };
  },
  props: {
    showDialog: Boolean,
    afterClose: {
      type: Function,
    },
    dataItem: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    showDialog(newV) {
      if (newV) {
        this.onGetData();
      }
    },
  },
  mounted() {
    this.cameraPatternList = this.$store.getters.dicList.CameraPattern;
  },
  methods: {
    onClose() {
      this.selectedDeviceCode = [];
      this.$emit("update:showDialog", false);
    },
    onAdd() {
      if (!this.selectedDeviceCode.length) {
        this.$message.warning("请选中需要添加的设备");
      } else {
        this.onAddLowCamera();
      }
    },
    onAddLowCamera() {
      this.loading = true;
      const parkId = this.checkParkId();
      request({
        url: "/low-video/low-video/addToPark",
        method: "post",
        data: {
          deviceCode: this.selectedDeviceCode,
          parkId,
        },
      }).then(() => {
        this.loading = false;
        this.$message.success("添加设备成功");
        this.onClose();
        this.afterClose();
      });
    },
    checkParkId() {
      const parkId = this.$store.getters.userParkId;
      if (!parkId) {
        this.$message.console.error("获取当前用户车场ID错误!");
      } else {
        return parkId;
      }
    },
    onTurnPage(val) {
      this.queryParams.current = val;
      this.onGetData();
    },
    onQuery() {
      this.selectedDeviceCode = [];
      this.onGetData();
    },
    onGetData() {
      request({
        url: "/low-video/low-video/getNotAdd",
        method: "post",
        data: this.queryParams,
      }).then((res) => {
        const { records = [], total = 0 } = res;
        this.records = records;
        this.totalCount = total;
        this.$nextTick(() => {
          this.records.forEach((item) => {
            this.selectedDeviceCode.forEach((selectedItem) => {
              if (selectedItem == item.deviceCode) {
                this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            });
          });
        });
      });
    },
    onSelectRow(selection) {
      const selectedCode = selection.map((val) => val.deviceCode);
      this.selectedDeviceCode = [
        ...new Set([...this.selectedDeviceCode, ...selectedCode]),
      ];
    },
  },
};
</script>
<style scoped lang="less">
.camera-list {
  padding-top: 24px;
  border-top: 1px solid #c0c4cc;
  &-title {
    color: #252525;
    line-height: 24px;
    margin-bottom: 24px;
  }
  .el-pagination--small {
    display: flex;
    justify-content: flex-end;
    padding: 12px 0;
  }
  .camera-table {
    height: 400px;
    overflow-y: scroll;
  }
}
.view-dialog .camera-list .el-input {
  width: 150px;
}
</style>
