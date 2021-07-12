<template>
  <div class="view">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备状态：">
          <el-select v-model="param.cameraStatus"
                     placeholder="请选择">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option v-for="item in cameraStatusList"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否绑定车位：">
          <el-select v-model="param.bindingFlag"
                     placeholder="请选择">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option v-for="item in bindFlagList"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定路段：">
          <el-input v-model="param.bindingRoad"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定车位：">
          <el-input v-model="param.bindingParkspace"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="相机模式：">
          <el-select v-model="param.cameraPattern"
                     placeholder="请选择">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option v-for="item in cameraPatternList"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
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
        <el-form-item style="margin-left:30px">
          <el-button type="primary"
                     size="medium"
                     @click="handleSearchTabel">查询</el-button>
          <!-- <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addData">新增相机</el-button> -->
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addHightCameraData">新增高位相机</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="batchDelete">批量删除</el-button>
          <!-- <el-button type="primary"
                       size="medium"
                       @click="addData">导出</el-button> -->
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
          <el-table-column prop="cameraType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraType', scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="cameraVersion"
                           label="设备版本号"
                           min-width="120">
          </el-table-column>
          <el-table-column prop="cameraStatus"
                           label="设备状态"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraStatus', scope.row.cameraStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraPattern"
                           label="相机模式"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraPattern', scope.row.cameraPattern) }}
            </template>
          </el-table-column>
          <el-table-column prop="bindingFlag"
                           label="是否绑定车位"
                           min-width="140">
            <template slot-scope="scope">
              {{ mappingDic('BindingFlag', scope.row.bindingFlag) }}
            </template>
          </el-table-column>
          <el-table-column prop="bindingNum"
                           label="绑定车位数量"
                           min-width="170">
          </el-table-column>
          <el-table-column prop="roadParkspace"
                           label="绑定路段及车位"
                           min-width="170">
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           width="150">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="editData(scope.row)">编辑</el-button>
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
    <editDialog :dialogVisible.sync="editVisible"
                :data-item="dataItem"
                @form-submit="searchData"></editDialog>
    <addHightDialog :dialogVisible.sync="hightCameraVisible"
                    @form-submit="searchData" />
  </div>
</template>

<script>
import * as api from '@/api/cameraManage';
import addDialog from './components/addDialog';
import editDialog from './components/editDialog';
import addHightDialog from './components/addHightDialog';
export default {
  components: { addDialog, editDialog, addHightDialog },
  data() {
    return {
      param: {
        bindingFlag: null,
        bindingParkspace: '',
        bindingRoad: '',
        cameraCode: '',
        cameraPattern: null,
        cameraStatus: null,
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      editVisible: false,
      hightCameraVisible: false,
      dataItem: null,
      tableData: [],
      multipleSelection: [],
      cameraStatusList: [],
      bindFlagList: [],
      cameraPatternList: [],
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
    this.cameraStatusList = this.$store.getters.dicList.CameraStatus;
    this.cameraPatternList = this.$store.getters.dicList.CameraPattern;
    this.bindFlagList = this.$store.getters.dicList.BindingFlag;
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
      this.param.cameraType = this.selectType.length ? this.selectType.join(',') : ''
      api.getData(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    addData() {
      this.addVisible = true;
    },
    addHightCameraData() {
      this.hightCameraVisible = true
    },
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.delData(...this.multipleSelection)
      } else {
        this.$message.warning('请选中需要删除的相机')
      }
    },
    delData(...rows) {
      const { parkCode, id } = this.$store.getters.parkLotObj
      let param = {
        cameraCode: rows.map((val) => val.cameraCode).join(','),
        parkCode: parkCode,
        parkId: id
      }
      this.$confirm('请确认是否删除高位相机', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          api.delData(param).then(() => {
            this.$message.success('删除相机成功');
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
  },
};
</script>
<style scoped lang="less"></style>
