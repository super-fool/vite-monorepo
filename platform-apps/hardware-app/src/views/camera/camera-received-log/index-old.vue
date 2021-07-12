<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto" inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定车位：">
          <el-input
            v-model="param.parkspaceCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="识别车牌：">
          <el-input
            v-model="param.cameraPlateNum"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件ID：">
          <el-input v-model="param.eventId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="事件类型：">
          <el-select v-model="cameraEventType" multiple placeholder="请选择">
            <el-option
              v-for="item in eventTypeList"
              :key="item.code"
              :label="item.type"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-select v-model="selectType" multiple placeholder="请选择">
            <el-option
              v-for="item in cameraType"
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
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
          <el-table-column prop="id" label="日志ID" min-width="120">
          </el-table-column>
          <el-table-column
            prop="cameraLogTime"
            label="业务时间"
            min-width="170"
          >
          </el-table-column>
          <el-table-column prop="cameraCode" label="相机编号" min-width="130">
          </el-table-column>
          <el-table-column
            prop="cameraEventType"
            label="事件类型"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ mappingDic("CameraEventType", scope.row.cameraEventType) }}
            </template>
          </el-table-column>

          <el-table-column prop="cameraType" label="设备类型" min-width="100">
            <template slot-scope="scope">
              {{ mappingDic("CameraType", scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cameraPlateNum"
            label="相机识别车牌"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="plateReliability"
            label="车牌可信度"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="eventReliability"
            label="车位可信度"
            min-width="120"
          >
          </el-table-column>
          <el-table-column prop="finishedFlag" label="是否完结" min-width="100">
            <template slot-scope="scope">
              {{ mappingDic("FinishedFlag", Number(scope.row.finishedFlag)) }}
            </template>
          </el-table-column>
          <el-table-column prop="eventId" label="事件ID" min-width="130">
          </el-table-column>
          <el-table-column
            prop="opppsideEventId"
            label="对应事件ID"
            min-width="130"
          >
          </el-table-column>
          <el-table-column
            prop="bindingRoadAndSpace"
            label="绑定路段及车位"
            min-width="230"
          >
          </el-table-column>
          <el-table-column
            prop="originalInfo"
            label="接收日志内容"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-button @click="logDetail(scope.row.originalInfo)"
                >查看</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleImgDetail(scope.row)"
                >图片</el-button
              >
              <el-button
                type="text"
                size="mini"
                :disabled="scope.row.cameraType == 1"
                @click="handleMarkImgDetail(scope.row)"
                >标记图</el-button
              >
              <!-- <el-button type="text"
                           @click="handleVideoDetail(scope.row)">查看视频</el-button> -->
              <el-button
                type="text"
                size="mini"
                @click="handleDayliDetail(scope.row)"
                >日志</el-button
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

    <ImageDetailDialog
      :dialogVisible.sync="imgDetailVisible"
      :data-item="imgItem"
    ></ImageDetailDialog>
    <ImageDetailDialog
      :dialogVisible.sync="markImgDetailVisible"
      :data-item="markImgItem"
    ></ImageDetailDialog>
    <editDialog
      :dialogVisible.sync="addVisible"
      :data-item="dataItem"
      @form-submit="searchData"
    ></editDialog>
    <detailDialog
      :dialogVisible.sync="detailVisible"
      :data-item="dataItem"
    ></detailDialog>
    <LogsDialog
      :dialogVisible.sync="logsVisible"
      :data-str="dataStr"
    ></LogsDialog>
  </div>
</template>

<script>
import * as api from "@/api/cameraLogs";
import editDialog from "./components/editDialog";
import detailDialog from "./components/detailDialog";
import ImageDetailDialog from "@/components/ImageDetailDialog";
import LogsDialog from "./components/LogDialog";
export default {
  components: {
    editDialog,
    detailDialog,
    ImageDetailDialog,
    LogsDialog,
  },
  data() {
    return {
      timeRange: null,
      param: {
        cameraCode: "",
        cameraEventType: "",
        cameraPlateNum: "",
        eventId: "",
        parkspaceCode: "",
        roadName: "",
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
      eventTypeList: [],
      detailVisible: false,
      imgItem: null,
      markImgItem: null,
      imgDetailVisible: false,
      markImgDetailVisible: false,
      logsVisible: false,
      cameraEventType: [],
      selectType: [],
      dataStr: "",
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
    cameraType() {
      return this.$store.state.dic.dicList.CameraType;
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
      this.param.cameraLogTimeBegin = this.timeRange ? this.timeRange[0] : "";
      this.param.cameraLogTimeEnd = this.timeRange ? this.timeRange[1] : "";
      this.param.cameraEventType = this.cameraEventType.length
        ? this.cameraEventType.join(",")
        : "";
      this.param.cameraType = this.selectType.length
        ? this.selectType.join(",")
        : "";
      api.getData(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    addData() {
      this.dataItem = null;
      this.addVisible = true;
    },
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.addVisible = true;
    },
    handleImgDetail(row) {
      this.imgItem = data;
      this.imgDetailVisible = true;
    },
    handleMarkImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.eventId,
          imageTypeCode: 1,
        })
        .then((data) => {
          this.markImgItem = data;
          this.markImgDetailVisible = true;
        });
    },
    // handleVideoDetail(row) {
    //   fileApi.viewVideo().then((data) => {
    //     this.imgItem = data;
    //     this.imgDetailVisible = true;
    //   });
    // },
    handleDayliDetail(row) {
      let data = { id: row.id, parkId: this.$store.getters.userParkId };
      // let data = {
      //   "id": "9110012345",
      //   "parkId": "123456"
      // }
      api.getDetail(data).then((data) => {
        console.log(data);
        this.dataItem = data;
        this.detailVisible = true;
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
    logDetail(text) {
      this.dataStr = text;
      this.logsVisible = true;
    },
    exportOutData() {
      let data = {
        ...this.param,
        cameraType: this.selectType.length ? this.selectType.join(",") : "",
      };
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, "高位相机接收日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>
<style scoped lang="less"></style>
