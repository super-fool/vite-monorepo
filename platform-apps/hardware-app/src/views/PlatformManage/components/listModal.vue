<template>
  <el-dialog class="view-dialog"
             title="车场列表"
             :visible.sync="dialogVisible"
             width="900px"
             :before-close="handleClose">
    <el-table :data="tableData"
              :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px',
            }"
              style="width: 100%">
      <el-table-column prop="parkName"
                       label="车场名称"
                       min-width="100">
      </el-table-column>
      <el-table-column prop="parkCode"
                       label="车场ID"
                       min-width="100">
      </el-table-column>
      <el-table-column prop="ParkSource"
                       label="车场性质"
                       min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.parkSource | getMenuType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stcId"
                       label="速停车ID"
                       min-width="100">
      </el-table-column>
    </el-table>
    <el-pagination style="margin:10px 0"
                   background
                   layout="prev, pager, next"
                   :page-sizes="[5, 10, 20]"
                   :page-size="param.size"
                   :current-page.sync="param.current"
                   :total="totalCount"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange">
    </el-pagination>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button type="primary"
                 @click="handleClose"
                 :loading="sending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data';
import * as api from '@/api/plateformManage';
export default {
  data() {
    return {
      regionData: regionData,
      sending: false,
      totalCount: 0,
      param: {
        id: '',
        current: 1,
        size: 10,
      },
      tableData: []
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Array,
      default() {
        return null;
      },
    },
    id: {
      type: String,
      default: ''
    },
  },
  filters: {
    getMenuType(v) {
      let text = '';
      switch (v) {
        case 0:
          text = '科拓车场';
          break;
        case 1:
          text = '第三方车场';
          break;
        default:
          text = '-';
          break;
      }
      return text;
    },
  },
  watch: {
    dialogVisible(newVal) {
      newVal && this.searchData()
    }
  },
  methods: {

    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    searchData() {
      this.param.id = this.id
      api.lotData(this.param).then((res) => {
        // this.listData = res
        this.tableData = res.records
        this.totalCount = res.total;
      }).catch(() => {
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
  },
};
</script>
<style scoped lang="less">
.el-pagination {
  text-align: center;
}
</style>
