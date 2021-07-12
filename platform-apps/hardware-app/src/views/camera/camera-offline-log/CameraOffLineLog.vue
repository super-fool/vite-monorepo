<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-select v-model="selectType"
                     multiple
                     placeholder="请选择">
            <el-option v-for="item in cameraType"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="medium"
                     @click="handleSearchTabel">查询</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="exportOutData">导出</el-button>
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content">
      <div class="view-content-table">
        <el-table :data="tableData"
                  border
                  :header-cell-style="{
              'background': '#f5f5f5',
              'line-height': '36px',
            }"
                  style="width: 100%">
          <el-table-column prop="cameraType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraType', scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="cameraVersion"
                           label="设备版本号"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="bindingRoadAndSpace"
                           label="绑定路段以及车位"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="offlineTime"
                           label="离线时间"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="lastOnlineTime"
                           label="上线时间"
                           min-width="130">
          </el-table-column>
          <!-- <el-table-column prop="cameraEventType"
                           label="事件类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraEventType', scope.row.cameraEventType) }}
            </template>
          </el-table-column> -->
          <el-table-column prop="onlineTotalTime"
                           label="本次在线时长"
                           min-width="120">
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background
                     layout="total, sizes,prev, pager, next"
                     :page-sizes="[5, 10, 20]"
                     :page-size="param.size"
                     :current-page.sync="param.current"
                     :total="totalCount"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/cameraOffLineLog';
export default {
  components: {},
  data() {
    return {
      param: {
        cameraCode: '',
        roadName: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      tableData: [],
      selectType: []
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
    cameraType() {
      return this.$store.state.dic.dicList.CameraType
    }
  },
  created() { },
  mounted() {
    this.eventTypeList = this.$store.getters.dicList.CameraEventType
    if (this.isSingle) this.param.parkId = this.$store.getters.userParkId;
    // this.param.parkId = '1346766821899620353';
    this.searchData();
  },
  methods: {
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
    },
    searchData() {
      this.param.cameraType = this.selectType.length ? this.selectType.join(',') : ''
      api.cameraOfflineLog(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    handleSizeChange(val) {
      console.log(val)
      this.param.current = 1;
      this.param.size = val;
      this.searchData();
    },
    exportOutData() {
      let data = {
        ...this.param,
        cameraType: this.selectType.length ? this.selectType.join(',') : ''
      }
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, '高位相机离线日志')
        this.$message.success('导出成功')
      })
    }
  }
};
</script>
<style scoped lang="less"></style>
