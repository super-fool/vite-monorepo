<template>
  <div class="view">
    <div>
      <header class="view-header">
        <el-form label-width="auto"
                 inline>
          <el-form-item label="车场编码：">
            <el-input v-model="param.parkCode"
                      placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="车场名称：">
            <el-input v-model="param.parkName"
                      placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="速停车ID：">
            <el-input v-model="param.stcId"
                      placeholder="请输入"></el-input>
          </el-form-item>
          <el-button type="primary"
                     size="medium"
                     @click="handleSearchTabel">查询</el-button>
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-plus"
                     @click="addData">新增车场</el-button>
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
            <el-table-column prop="parkCode"
                             label="车场编码"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="parkName"
                             label="车场名称"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="stcId"
                             label="速停车ID"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="parkType"
                             label="车场类型"
                             min-width="100">
              <template slot-scope="scope">
                {{ mappingDic('ParkType', scope.row.parkType) }}
              </template>
            </el-table-column>
            <el-table-column prop="ParkSource"
                             label="车场性质"
                             min-width="100">
              <template slot-scope="scope">
                {{ mappingDic('ParkSource', scope.row.parkSource) }}
              </template>
            </el-table-column>
            <el-table-column prop="address"
                             label="车场地址"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="createTime"
                             label="同步时间"
                             min-width="170">
            </el-table-column>
            <el-table-column prop="updateTime"
                             label="更新时间"
                             min-width="170">
            </el-table-column>
            <el-table-column label="操作"
                             fixed="right"
                             width="200">
              <template slot-scope="scope">
                <!-- <el-button type="text"
                           @click="editData(scope.row)">编辑</el-button> -->
                <el-button type="text"
                           @click="syncData(scope.row)">同步路段车位</el-button>
                <el-button type="text"
                           class="danger-btn"
                           @click="delData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-sizes="[5, 10, 20]"
                       :page-size="param.size"
                       :current-page.sync="param.current"
                       :total="totalCount"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
    <editDialog :dialogVisible.sync="addVisible"
                :data-item="dataItem"
                @form-submit="searchData"></editDialog>
  </div>
</template>

<script>
import * as api from '@/api/parkingLotManage';
import editDialog from './components/editDialog';
export default {
  components: { editDialog },
  data() {
    return {
      param: {
        parkName: '',
        parkCode: '',
        id: '',
        stcId: '',
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      dataItem: null,
      tableData: [],
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
    },
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
    syncData(row) {
      api.syncData({ id: row.id }).then(res => {
        if (res) {
          this.$message.success('同步成功')
        } else {
          this.$message.error('同步失败')
        }
      })
    },
    delData(row) {
      this.$confirm('确认是否删除该车场', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          api.delData({ id: row.id }).then(() => {
            this.$message.success('删除车场成功');
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
