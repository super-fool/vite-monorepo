<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="业务时间：">
          <el-date-picker v-model="time"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="相机识别车牌：">
          <el-input v-model="param.cameraPlateNum"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="审核人：">
          <el-input v-model="param.auditPerson"
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
                  :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px',
            }"
                  style="width: 100%">
          <el-table-column prop="businessTime"
                           label="业务时间"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
                           min-width="170">
          </el-table-column>
          <el-table-column prop="cameraEventType"
                           label="事件类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraEventType', scope.row.cameraEventType) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraType', scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraPlateNum"
                           label="相机识别车牌"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="pushPlateNum"
                           label="推送车牌"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="auditResult"
                           label="审核结果"
                           min-width="120">
            <template slot-scope="scope">
              {{ mappingDic('AgentAuditResult',scope.row.auditResult) }}
            </template>
          </el-table-column>
          <el-table-column prop="auditPerson"
                           label="审核人"
                           min-width="100">

          </el-table-column>
          <el-table-column prop="auditTime"
                           label="完成审核时间"
                           min-width="130">
          </el-table-column>
          <el-table-column prop="eventSource"
                           label="事件来源"
                           min-width="120">
            <template slot-scope="scope">
              {{ mappingDic('EventSource',scope.row.eventSource) }}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="200">
            <template slot-scope="scope">
              <el-button type="text"
                         size="mini"
                         @click="handleImgDetail(scope.row)">图片</el-button>
              <el-button type="text"
                         size="mini"
                         @click="handleMarkImgDetail(scope.row)">标记图</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background
                     layout="total,sizes,prev, pager, next"
                     :page-sizes="[5, 10, 20]"
                     :page-size="param.size"
                     :current-page.sync="param.current"
                     :total="totalCount"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <ImageDetailDialog :dialogVisible.sync="imgDetailVisible"
                     :data-item="imgItem"></ImageDetailDialog>
    <ImageDetailDialog :dialogVisible.sync="markImgDetailVisible"
                     :data-item="markImgItem"></ImageDetailDialog>
    <!-- <editDialog :dialogVisible.sync="addVisible"
                :data-item="dataItem"
                @form-submit="searchData"></editDialog>
    <detailDialog :dialogVisible.sync="detailVisible"
                  :data-item="dataItem"></detailDialog> -->
  </div>
</template>

<script>
import * as api from '@/api/audit';
import ImageDetailDialog from '@/components/ImageDetailDialog';
// import editDialog from './components/editDialog';
// import detailDialog from './components/detailDialog'
export default {
  components: {
    ImageDetailDialog,
    // detailDialog
  },
  data() {
    return {
      param: {
        auditPerson: '',
        businessTime: '',
        cameraCode: '',
        cameraPlateNum: '',
        beginTime: '',
        endTime: '',
        current: 1,
        size: 10,
      },
      time: [],
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
    this.eventTypeList = this.$store.getters.dicList.CameraEventType;
    if (this.isSingle) this.param.parkId = this.$store.getters.userParkId;
    // this.param.parkId = '1346766821899620353';
    this.searchData();
  },
  methods: {
    handleSearchTabel() {
      this.param.beginTime = this.time[0]
      this.param.endTime = this.time[1]
      this.param.current = 1;
      this.searchData();
    },
    searchData() {
      this.param.cameraType = this.selectType.length ? this.selectType.join(',') : ''
      api.findAllCheckedAgent(this.param).then((res) => {
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
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    handleSizeChange(val) {
      this.param.current = 1;
      this.param.size = val;
      this.searchData();
    },
    handleImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.eventId,
          imageTypeCode: 0
        })
        .then((data) => {
          this.imgItem = data;
          this.imgDetailVisible = true;
        });
    },
    handleMarkImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.eventId,
          imageTypeCode: 1
        })
        .then((data) => {
          this.markImgItem = data;
          this.markImgDetailVisible = true;
        });
    },
    exportOutData() {
      let data = {
        ...this.param,
        cameraType: this.selectType.length ? this.selectType.join(',') : ''
      }
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, '已审核列表')
        this.$message.success('导出成功')
      })
    }
  },
};
</script>
<style scoped lang="less"></style>
