<template>
  <div class="view">
    <div v-if="!isSingle">
      <header class="view-header">
        <el-form label-width="auto"
                 inline>
          <el-form-item>
            <el-button type="primary"
                       @click="addData()">添加平台</el-button>
          </el-form-item>
        </el-form>
      </header>
      <div class="view-content">
        <div class="view-content-table">
          <el-table :data="tableData"
                    :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px'
            }"
                    style="width: 100%">
            <el-table-column prop="serverName"
                             label="平台名称"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="url"
                             label="平台地址(URL)"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="stcId"
                             label="车场列表"
                             min-width="100">
              <template slot-scope="scope">
                <el-button style="padding-left:14px"
                           @click="getListData(scope.row)">车场列表</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             fixed="right"
                             width="250">
              <template slot-scope="scope">
                <el-button type="text"
                           :disabled="scope.row.syncLoading"
                           @click="syncData(scope.row)">同步车场</el-button>
                <el-button type="text"
                           @click="editData(scope.row)">编辑平台</el-button>
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
    <!-- <editDialog :dialogVisible.sync="addVisible"
                :data-item="dataItem"
                @form-submit="searchData"></editDialog> -->
    <platformModal :dialogVisible.sync="configVisible"
                   @form-submit="searchData"
                   :data-item="dataItem"></platformModal>
    <listModal :dialogVisible.sync="listVisible"
               :id="lotId"></listModal>
  </div>
</template>

<script>
import * as api from '@/api/plateformManage.js';
import platformModal from './components/platformModal';
import listModal from './components/listModal';
export default {
  components: { platformModal, listModal },
  data() {
    return {
      param: {
        // parkName: '',
        // parkId: '',
        // id: '',
        // stcId: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      configVisible: false,
      listVisible: false,
      dataItem: null,
      lotId: null,
      tableData: []
    };
  },
  computed: {
    isSingle() {
      return !this.$store.getters.isAdmin;
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
      api.getData(this.param).then((res) => {
        this.tableData = res.records.map((item) => {
          item.syncLoading = false;
          return item;
        });
        this.totalCount = res.total;
      });
    },
    addData() {
      this.dataItem = null;
      this.configVisible = true;
    },
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.configVisible = true;
    },
    getListData(row) {
      this.listVisible = true;
      this.lotId = row.id;
    },
    syncData(row) {
      row.syncLoading = true;
      api
        .syncData({ id: row.id })
        .then(() => {
          row.syncLoading = false;
          this.$message.success('同步车场成功');
        })
        .catch(() => {
          this.$message.error('同步车场失败');
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
    }
  }
};
</script>
<style scoped lang="less"></style>
