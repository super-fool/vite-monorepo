<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto" inline>
        <el-form-item label="事件ID：">
          <el-input v-model="param.eventId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="IMEI：">
          <el-input v-model="param.imei" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定车位：">
          <el-input v-model="param.parkspaceNo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="指令类型：">
          <el-select v-model="param.type" placeholder="请选择">
            <el-option
              v-for="item in lotCommandType"
              :key="item.code"
              :label="item.type"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否转发：">
          <el-select v-model="param.pushStatus" placeholder="请选择">
            <el-option
              v-for="item in lotPushStatus"
              :key="item.code"
              :label="item.type"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务时间：">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="handleSearchTabel"
            >查询</el-button
          >
          <el-button type="primary" size="medium" @click="exportOutData"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content">
      <div class="view-content-table">
        <el-table
          :data="tableData"
          border
          :header-cell-style="{
            background: '#f5f5f5',
            'line-height': '36px',
          }"
          style="width: 100%"
        >
          <el-table-column prop="eventId" label="事件ID" min-width="120">
          </el-table-column>
          <el-table-column
            prop="cameraEventType"
            label="设备类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ mappingDic("DeviceType", scope.row.deviceType) }}
            </template>
          </el-table-column>
          <el-table-column prop="imei" label="IMEI" min-width="130">
          </el-table-column>
          <el-table-column prop="roadName" label="绑定路段" min-width="120">
          </el-table-column>
          <el-table-column prop="parkspaceNo" label="绑定车位" min-width="120">
          </el-table-column>
          <el-table-column prop="type" label="接收指令类型" min-width="170">
            <template slot-scope="scope">
              {{ mappingDic("IotCommandType", Number(scope.row.type)) }}
            </template>
          </el-table-column>
          <el-table-column prop="eventTime" label="业务时间" min-width="170">
          </el-table-column>
          <el-table-column prop="content" label="接收指令内容" min-width="120">
            <template slot-scope="scope">
              <!-- <el-buttton @click="openDetail(scope.row.finishedFlag)">查看</el-buttton>
               -->
              <el-button @click="openDetail(scope.row.content)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pushStatus" label="是否转发" min-width="100">
            <template slot-scope="scope">
              <el-button
                :disabled="!scope.row.pushStatus"
                @click="toLogs(scope.row)"
              >
                {{
                  mappingDic("IotPushStatus", Number(scope.row.pushStatus))
                }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="total, sizes,prev, pager, next"
        :page-sizes="[5, 10, 20]"
        :page-size="param.size"
        :current-page.sync="param.current"
        :total="totalCount"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
    <LogsDialog
      :dialogVisible.sync="receivedLog.check"
      :data-str="receivedLog.logStr"
      :title="receivedLog.title"
    ></LogsDialog>
  </div>
</template>

<script>
import * as api from "@/api/geomagnetis.js";
import LogsDialog from "./components/LogsDialog";
export default {
  components: { LogsDialog },
  data() {
    return {
      timeRange: null,
      param: {
        eventId: "",
        imei: "",
        roadName: "",
        parkspaceNo: "",
        type: "",
        pushStatus: "",
        current: 1,
        size: 10,
      },
      receivedLog: {
        check: false,
        logStr: "",
        title: "",
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [
        {
          eventReliability: 1,
        },
      ],
      eventTypeList: [],
      imgItem: null,
      markImgItem: null,
      cameraEventType: [],
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
    lotPushStatus() {
      return this.$store.state.dic.dicList.IotPushStatus;
    },
    lotCommandType() {
      return this.$store.state.dic.dicList.IotCommandType;
    },
  },
  created() {},
  mounted() {
    this.eventTypeList = this.$store.getters.dicList.CameraEventType;
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
      this.param.eventTimeBegin = this.timeRange ? this.timeRange[0] : "";
      this.param.eventTimeEnd = this.timeRange ? this.timeRange[1] : "";
      // this.param.cameraEventType = this.cameraEventType.length ? this.cameraEventType.join(',') : ''
      api.getList(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    handleSizeChange(val) {
      console.log(val);
      this.param.current = 1;
      this.param.size = val;
      this.searchData();
    },
    openDetail(text) {
      this.receivedLog.check = true;
      this.receivedLog.logStr = text;
      this.receivedLog.title = "指令内容";
    },
    toLogs(row) {
      if (row.pushStatus) {
        this.$router.push({
          path: "/geomagnetismLogs",
          query: { id: row.eventId },
        });
      }
    },
    exportOutData() {
      api.loadNbiotRecordLogs(this.param).then((res) => {
        this.util.exportHandel(res, "地磁接收日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>
<style scoped lang="less"></style>
