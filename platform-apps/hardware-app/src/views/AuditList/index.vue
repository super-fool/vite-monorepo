<template>
  <div class="view">
    <header class="view-header pb-24">
      <span class="view-header-count font-18 bold mr-15">待审核数量：{{ totalCount }}</span>
      <el-button type="primary"
                 @click="liveVideoHandel">打开实时视频</el-button>
      <el-button type="primary"
                 @click="startAudit">开始审核</el-button>
    </header>
    <div class="view-content">
      <div class="view-content-table">
        <el-table :data="tableData"
                  :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px'
            }"
                  style="width: 100%">
          <el-table-column prop="businessTime"
                           label="业务时间"
                           min-width="200">
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
          <el-table-column prop="cameraPlateNum"
                           label="相机识别车牌"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="plateReliability"
                           label="车牌可信度"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="eventReliability"
                           label="车位可信度"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="pushReason"
                           label="审核理由"
                           min-width="100">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="200">
            <template slot-scope="scope">
              <!-- <el-button type="text"
                           @click="handleImgDetail(scope.row)">查看图片</el-button>
                <el-button type="text"
                           @click="handleVideoDetail(scope.row)">查看视频</el-button> -->
              <el-button type="text"
                         @click="auditEvent(scope.row)">审核</el-button>
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
    <!-- <editDialog :dialogVisible.sync="addVisible"
                :data-item="dataItem"
                @form-submit="searchData"></editDialog> -->
    <auditDialog :dialogVisible.sync="auditModalVisible"
                 :area="cameraCodeInArea"
                 :continuousAudit="continuousAudit"
                 :data-item="dataItem"></auditDialog>
  </div>
</template>

<script>
import * as api from '@/api/audit';
import auditDialog from './components/auditDialog';
// import detailDialog from './components/detailDialog'
export default {
  components: {
    auditDialog
    // detailDialog
  },
  data() {
    return {
      param: {
        current: 1,
        size: 10
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
      eventTypeList: [],
      auditModalVisible: false,
      inId: '',
      auditStatus: null, // 0 待审核 1审核中 2审核结束
      continuousAudit: true,
      cameraCodeInArea: [],
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    }
  },
  created() {
    localStorage.removeItem('livingCode');
  },
  mounted() {
    this.eventTypeList = this.$store.getters.dicList.CameraEventType;
    if (this.isSingle) this.param.parkId = this.$store.getters.userParkId;
    // this.param.parkId = '1370980801046515714';
    this.searchData();
    this.findAuditSetting()
  },
  methods: {
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
    },
    searchData() {
      api.findAllNotCheckAgent(this.param).then((res) => {
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
    async startAudit() {
      await this.checkAuditStatus();
      this.$store.dispatch('user/auditClick', true);
      if (this.inId) {
        // 有审核中的事件
        this.$confirm('是否继续该事件的审核?', '有审核中事件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 进入审核详情页
            this.$router.push({
              path: '/AuditDetail',
              query: { id: this.inId, parkId: this.$store.getters.userParkId }
            });
          })
          .catch(() => {
            let data = { id: this.inId };
            api.handleIgnore(data).then(() => {
              this.auditModalVisible = true;
            });

          });
      } else {
        // 无审核事件
        this.auditModalVisible = true;
      }
    },
    checkAuditStatus() {
      let data = { parkId: this.$store.getters.userParkId };
      // let data = { parkId: '1346766821899620353' }
      return api.checkAuditStatus(data).then((data) => {
        this.auditStatus = data && data.auditStatus;
        this.inId = data && data.id;
      });
    },

    async auditEvent(row) {
      await this.checkAuditStatus();
      this.$store.dispatch('user/auditClick', true);
      if (this.inId) {
        // 有审核中的事件
        this.$confirm('是否继续该事件的审核?', '有审核中事件', {
          confirmButtonText: '继续',
          cancelButtonText: '忽略',
          type: 'warning'
        })
          .then(() => {
            // 进入审核详情页
            this.$router.push({
              path: '/AuditDetail',
              query: { id: this.inId, parkId: this.$store.getters.userParkId }
            });
          })
          .catch(() => {
            let data = { id: this.inId };
            api.handleIgnore(data).then(() => {
              api.getAgentStatus(data).then((status) => {
                if (status == 0) {
                  // 待审核
                  this.$router.push({
                    path: '/AuditDetail',
                    query: { id: row.id, parkId: row.parkId }
                  });
                }
                if (status == 1) {
                  this.$message.error('该事件正在审核中，请选择其他事件');
                }
                if (status == 2) {
                  this.$message.error('该事件已审核，请选择其他事件');
                }
              });
            });
          })
          .catch(() => {
            let data = { id: this.inId };
            api.handleIgnore(data).then(() => {
              api.getAgentStatus(data).then((status) => {
                if (status == 0) {
                  // 待审核
                  this.$router.push({
                    path: '/AuditDetail',
                    query: {
                      id: row.id,
                      parkId: this.$store.getters.userParkId
                    }
                  });
                }
                if (status == 1) {
                  this.$message.error('该事件正在审核中，请选择其他事件');
                }
                if (status == 2) {
                  this.$message.error('该事件已审核，请选择其他事件');
                }
              });
            });
          });
      } else {
        // 无审核事件
        if (row.auditStatus == 0) {
          // 待审核
          this.$router.push({
            path: '/AuditDetail',
            query: { id: row.id, parkId: this.$store.getters.userParkId }
          });
        }
        if (row.auditStatus == 1) {
          this.$message.error('该事件正在审核中，请选择其他事件');
        }
        if (row.auditStatus == 2) {
          this.$message.error('该事件已审核，请选择其他事件');
        }
      }
    },
    liveVideoHandel() {
      const url = window.location.origin + '/#/CameraLivingVideo';
      window.open(url);
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
    findAuditSetting() {
      api.findAuditSetting({ parkId: this.$store.getters.userParkId }).then(data => {
        if (data.length) {
          this.cameraCodeInArea = data
          this.continuousAudit = data.some(item => {
            return item.isEnable == 1
          })
        } else {
          this.continuousAudit = true
        }
      })
    },
  }
};
</script>
<style scoped lang="less">
.view {
  &-header {
    &-count {
      font-size: 18px;
      font-weight: bold;
      margin-right: 15px;
    }
  }
  .pb-24 {
    padding-bottom: 24px;
  }
}
</style>
