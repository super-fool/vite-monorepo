<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="事件ID：">
          <el-input v-model="param.eventId"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="IMEI：">
          <el-input v-model="param.imei"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定车位：">
          <el-input v-model="param.parkspaceNo"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="指令类型：">
          <el-select v-model="param.type"
                     placeholder="请选择">
            <el-option v-for="item in lotCommandType"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="返回第三方结果：">
          <el-select v-model="param.pushResult"
                     placeholder="请选择">
            <el-option v-for="item in NbiotPushResult"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务时间：">
          <el-date-picker v-model="timeRange"
                          format="yyyy-MM-dd"
                          type="daterange"
                          range-separator="至"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送第三方时间：">
          <el-date-picker v-model="timeRange2"
                          format="yyyy-MM-dd"
                          type="daterange"
                          range-separator="至"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
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
          <el-table-column prop="eventId"
                           label="事件ID"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="pushTime"
                           label="发送第三方时间"
                           min-width="170">
          </el-table-column>
          <el-table-column prop="deviceType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('DeviceType', scope.row.deviceType) }}
            </template>
          </el-table-column>
          <el-table-column prop="imei"
                           label="IMEI"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="roadName"
                           label="绑定路段"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="parkspaceNo"
                           label="绑定车位"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="pushType"
                           label="事件类型"
                           min-width="120">
            <template slot-scope="scope">
              {{ mappingDic('PushType', Number(scope.row.pushType)) }}
            </template>
          </el-table-column>
          <el-table-column prop="pushResult"
                           label="第三方返回结果"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('NbiotPushResult', Number(scope.row.pushResult)) }}
            </template>
          </el-table-column>
          <el-table-column prop="eventTime"
                           label="业务时间"
                           min-width="130">
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
import * as api from '@/api/geomagnetis.js';
export default {
  components: {},
  data() {
    return {
      param: {
        eventId: '',
        imei: '',
        roadName: '',
        parkspaceNo: '',
        type: '',
        pushStatus: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
      eventTypeList: [],
      imgItem: null,
      markImgItem: null,
      cameraEventType: [],
      timeRange: [],
      timeRange2: []
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
    Pushtype() {
      return this.$store.state.dic.dicList.Pushtype
    },
    NbiotPushResult() {
      return this.$store.state.dic.dicList.NbiotPushResult
    }
  },
  created() { },
  mounted() {
    this.eventTypeList = this.$store.getters.dicList.CameraEventType
    if (this.$route.query.id) {
      this.param.eventId = this.$route.query.id
    }
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
      this.param.eventTimeBegin = this.timeRange ? this.timeRange[0] : '';
      this.param.eventTimeEnd = this.timeRange ? this.timeRange[1] : '';
      this.param.pushTimeBegin = this.timeRange2 ? this.timeRange2[0] : '';
      this.param.pushTimeEnd = this.timeRange2 ? this.timeRange2[1] : '';
      // this.param.cameraEventType = this.cameraEventType.length ? this.cameraEventType.join(',') : ''
      api.getSendList(this.param).then((res) => {
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
      api.loadNbiotSendLogs(this.param).then(res => {
        this.util.exportHandel(res, '地磁发送日志')
        this.$message.success('导出成功')
      })
    }
  }
};
</script>
<style scoped lang="less"></style>
