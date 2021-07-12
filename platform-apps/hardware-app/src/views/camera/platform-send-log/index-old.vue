<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.deviceNo"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="推送路段：">
          <el-input v-model="param.roadName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="推送车位：">
          <el-input v-model="param.parkspaceCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="识别车牌：">
          <el-input v-model="param.cameraPlateNum"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="推送车牌：">
          <el-input v-model="param.pushPlateNum"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="事件ID：">
          <el-input v-model="param.sourceEventId"
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
        <el-form-item label="业务时间：">
          <el-date-picker v-model="businessTimeRange"
                          type="daterange"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送时间：">
          <el-date-picker v-model="pushTimeRange"
                          type="daterange"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="medium"
                     @click="handleSearchTabel">查询</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content">
      <div class="view-content-table">
        <el-table border
                  :data="tableData"
                  :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px'
            }"
                  style="width: 100%">
          <el-table-column prop="sourceEventId"
                           label="事件ID"
                           min-width="200">
          </el-table-column>
          <el-table-column prop="pushTime"
                           label="发送第三方时间"
                           min-width="170">
          </el-table-column>
          <el-table-column prop="pushSource"
                           label="日志来源"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('PushSource', scope.row.pushSource) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="sourceEventType"
                           label="事件类型"
                           min-width="120">
            <template slot-scope="scope">
              {{
                  mappingDic(
                    'CameraEventType',
                    Number(scope.row.sourceEventType)
                  )
                }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraType', scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column prop="businessTime"
                           label="业务时间"
                           min-width="170">
          </el-table-column>
          <el-table-column prop="cameraPlateNum"
                           label="相机识别车牌"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="pushPlateNum"
                           label="推送车牌"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="pushResult"
                           label="发送结果"
                           min-width="170">
            <template slot-scope="scope">
              {{ mappingDic('PushResult', scope.row.pushResult) }}
            </template>
          </el-table-column>
          <el-table-column prop="roadName"
                           label="推送路段"
                           min-width="150">
          </el-table-column>
          <el-table-column prop="parkspaceCode"
                           label="推送车位"
                           min-width="100">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="140">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="handleImgDetail(scope.row)">查看图片</el-button>
              <el-button type="text"
                         :disabled="scope.row.cameraType == 1"
                         @click="handleMarkImgDetail(scope.row)">标记图片</el-button>
            </template>
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
    <ImageDetailDialog :dialogVisible.sync="imgDetailVisible"
                     :data-item="imgItem"></ImageDetailDialog>
    <ImageDetailDialog :dialogVisible.sync="markImgDetailVisible"
                     :data-item="markImgItem"></ImageDetailDialog>
  </div>
</template>

<script>
import * as api from '@/api/platformSendLogs';
import ImageDetailDialog from '@/components/ImageDetailDialog';
export default {
  components: {
    ImageDetailDialog
  },
  data() {
    return {
      businessTimeRange: null,
      pushTimeRange: null,
      param: {
        cameraPlateNum: '',
        deviceNo: '',
        parkspaceCode: '',
        pushPlateNum: '',
        roadName: '',
        // businessTime: '',
        // pushTime: '',
        sourceEventId: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
      imgItem: null,
      imgDetailVisible: false,
      markImgItem: null,
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
    if (this.isSingle) this.param.parkId = this.$store.getters.userParkId;
    this.searchData();
  },
  methods: {
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
    },
    searchData() {
      this.param.businessTimeBegin = this.businessTimeRange
        ? this.businessTimeRange[0]
        : '';
      this.param.businessTimeEnd = this.businessTimeRange
        ? this.businessTimeRange[1]
        : '';
      this.param.pushTimeBegin = this.pushTimeRange
        ? this.pushTimeRange[0]
        : '';
      this.param.pushTimeEnd = this.pushTimeRange ? this.pushTimeRange[1] : '';
      this.param.cameraType = this.selectType.length ? this.selectType.join(',') : ''
      api.getData(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    handleImgDetail(row) {
      this.imgItem = null
      api
        .viewImage({
          eventId: row.sourceEventId
        })
        .then((data) => {
          this.imgItem = data;
          this.imgDetailVisible = true;
        });
    },
    handleMarkImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.sourceEventId,
          imageTypeCode: 1
        })
        .then((data) => {
          this.markImgItem = data;
          this.markImgDetailVisible = true;
        });
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
    exportData() {
      let data = {
        ...this.param,
        cameraType: this.selectType.length ? this.selectType.join(',') : ''
      }
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, '硬件平台发送日志')
        this.$message.success('导出成功')
      })
    }
  }
};
</script>
<style scoped lang="less"></style>
