<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="IMEI：">
          <el-input v-model="param.imei"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="IMSI：">
          <el-input v-model="param.imsi"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="运营商：">
          <el-select v-model="param.iot"
                     placeholder="请选择">
            <el-option v-for="item in dicList.IotService"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态：">
          <el-select v-model="param.online"
                     placeholder="请选择">
            <el-option v-for="item in dicList.IotStatus"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否绑定车位：">
          <el-select v-model="param.bindStatus"
                     placeholder="请选择">
            <el-option v-for="item in dicList.BindingFlag"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定车位：">
          <el-input v-model="param.parkspaceNo"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:30px">
          <el-button type="primary"
                     size="medium"
                     @click="handleSearchTabel">查询</el-button>
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addData">添加</el-button>
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addDataBatch">批量添加</el-button>
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addBatchDirective">批量发送指令</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="batchDelete">批量删除</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="exportOutData">导出</el-button>
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content">
      <div class="view-content-table">
        <el-table :data="tableData"
                  ref="multipleTable"
                  @selection-change="handleSelectionChange"
                  :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px',
            }"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="70">
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
                           min-width="100">
          </el-table-column>
          <el-table-column prop="deviceVersion"
                           label="设备版本号"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="iot"
                           label="运营商"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="online"
                           label="设备状态"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('IotStatus', scope.row.online) }}
            </template>
          </el-table-column>
          <el-table-column prop="imsi"
                           label="IMSI"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="bindStatus"
                           label="是否绑定车位"
                           min-width="140">
            <template slot-scope="scope">
              {{ mappingDic('BindingFlag', scope.row.bindStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="roadName"
                           label="绑定路段"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="parkspaceNo"
                           label="绑定车位"
                           min-width="170">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="230">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="sendDirect(scope.row)">发送指令</el-button>
              <el-button type="text"
                         @click="configData(scope.row)">配置</el-button>
              <el-button type="text"
                         class="danger-btn"
                         @click="delData(scope.row)">删除</el-button>
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
    <addDialog :dialogVisible.sync="addVisible"
               @form-submit="searchData"></addDialog>
    <addBatchDialog :dialogVisible.sync="batchVisible"
                    @form-submit="searchData"></addBatchDialog>
    <configDialog :dialogVisible.sync="configVisible"
                  :data-item="configItem"
                  @form-submit="searchData" />
    <sendDirect :dialogVisible.sync="directVisible"
                :data-item="dataItem"
                @form-submit="searchData" />
    <batchDirect :dialogVisible.sync="batchDirectVisible"
                 :list="multipleSelection"
                 @form-submit="searchData" />
  </div>
</template>

<script>
import * as api from '@/api/geomagnetis.js';
import addDialog from './components/addDialog';
import addBatchDialog from './components/addBatchDialog';
import configDialog from './components/configDialog';
import sendDirect from './components/sendDirect';
import batchDirect from './components/batchDirect';
import * as vx from "vuex";
export default {
  components: {
    addDialog,
    addBatchDialog,
    configDialog,
    sendDirect,
    batchDirect
  },
  data() {
    return {
      param: {
        imei: '',
        imsi: '',
        iot: '',
        online: '',
        bindStatus: '',
        roadName: '',
        parkspaceNo: '',
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      batchVisible: false,
      configVisible: false,
      directVisible: false,
      batchDirectVisible: false,
      dataItem: null,
      configItem: null,
      tableData: [{}],
      multipleSelection: [],
      cameraStatusList: [],
      bindFlagList: [],
      cameraPatternList: []
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
    ...vx.mapGetters(["dicList"])
  },
  created() { },
  mounted() {
    if (this.isSingle) this.param.parkId = this.$store.getters.userParkId;
    this.searchData();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSearchTabel() {
      this.param.current = 1;
      this.searchData();
      this.$refs.multipleTable.clearSelection();
    },
    searchData() {
      api.getManegeList(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    addData() {
      this.addVisible = true;
    },
    addDataBatch() {
      this.batchVisible = true


    },
    addBatchDirective() {
      if (this.multipleSelection.length > 0) {
        this.batchDirectVisible = true;
      } else {
        this.$message.warning('请选中需要下发指令的地磁')
      }
    },
    configData(row) {
      this.configItem = JSON.parse(JSON.stringify(row));
      this.configVisible = true
    },
    sendDirect(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.directVisible = true
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {

        this.$confirm('请确认是否删除地磁', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            api.deleteDataBatch(this.multipleSelection).then(() => {
              this.$message.success('删除地磁成功');
              this.searchData();
            });
          })
          .catch(() => { });
      } else {
        this.$message.warning('请选中需要删除的相机')
      }
    },
    delData(rows) {
      let { deviceCode, id, iot } = rows
      this.$confirm('请确认是否删除地磁', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          api.deleteData({ deviceCode, id, iot }).then(() => {
            this.$message.success('删除地磁成功');
            this.searchData();
          });
        })
        .catch(() => { });
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
    exportOutData() {
      api.loadNbiotManege(this.param).then(res => {
        this.util.exportHandel(res, '地磁管理')
        this.$message.success('导出成功')
      })
    }
  },
};
</script>
<style scoped lang="less"></style>
