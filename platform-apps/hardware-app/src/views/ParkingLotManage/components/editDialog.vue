<template>
  <el-dialog class="view-dialog"
             :title="dataItem ? '编辑车场' : '新增车场'"
             :visible.sync="dialogVisible"
             width="1020px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="车场名称：">
          <el-input v-model="param.parkName"
                    maxlength="128"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="车场编码：">
          <el-input v-model="param.parkCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-button type="primary"
                   size="medium"
                   @click="handleSearchTabel">查询</el-button>
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
          <el-table-column prop="serverName"
                           label="平台名称"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="parkName"
                           label="车场名称"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="parkCode"
                           label="车场编码"
                           min-width="100">
          </el-table-column>
          <el-table-column label="车场性质"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('ParkSource', scope.row.parkSource) }}
            </template>
          </el-table-column>
          <el-table-column prop="stcId"
                           label="速停车ID"
                           min-width="100">
          </el-table-column>
          <el-table-column label="操作"
                           width="200">
            <template slot-scope="scope">
              <el-button type="primary"
                         @click="addData(scope.row)">添加</el-button>
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
  </el-dialog>
</template>

<script>
import * as api from '@/api/parkingLotManage';

export default {
  data() {
    return {
      sending: false,
      param: {
        parkName: '',
        parkCode: '',
        current: 1,
        size: 10,
      },
      totalCount: 0,
      addVisible: false,
      tableData: [],
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    dialogVisible(val) {
      val &&
        this.$nextTick(() => {
          this.param = {
            parkName: '',
            parkCode: '',
            current: 1,
            size: 10,
          };
          this.getNotAddParkings();
        });
    },
  },
  created() { },
  mounted() { },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSearchTabel() {
      this.param.current = 1;
      this.getNotAddParkings();
    },
    getNotAddParkings() {
      api.getNotAddParkings(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.getNotAddParkings();
    },
    handleSizeChange(val) {
      this.param.current = 1;
      this.param.size = val;
      this.getNotAddParkings();
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    addData(row) {
      api.addData(row).then(() => {
        this.$message.success('新增车场成功');
        this.$emit('update:dialogVisible', false);
        this.$emit('form-submit');
      })
        .then(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less"></style>
