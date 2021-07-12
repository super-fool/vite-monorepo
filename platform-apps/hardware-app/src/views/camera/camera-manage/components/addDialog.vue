<template>
  <el-dialog class="view-dialog"
             title="新增相机"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <header class="view-header">
      <el-form label-width="auto"
               inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode"
                    maxlength="128"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-button type="primary"
                   size="medium"
                   @click="handleSearchTabel">查询</el-button>
      </el-form>
      <el-form>
        <el-form-item label="选择添加后的相机模式:">
          <el-select v-model="addParam.cameraPattern"
                     placeholder="请选择">
            <el-option v-for="item in cameraPatternList"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </header>
    <div class="view-content"
         style="padding-top:0">
      <div class="view-content-table">
        <el-table :data="tableData"
                  ref="multipleTable"
                  :row-key="getRowkeys"
                  @selection-change="selectionChange"
                  :header-cell-style="{
                      background: '#f5f5f5',
                      'line-height': '36px',
                    }"
                  style="width: 100%">
          <el-table-column type="selection"
                           reserve-selection
                           width="70">
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号">
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
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary"
                 @click="addData"
                 :loading="sending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/cameraManage';
import * as vx from 'vuex';
export default {
  data() {
    return {
      sending: false,
      param: {
        cameraCode: '',
        current: 1,
        size: 5,
      },
      addParam: {
        cameraCode: '',
        cameraPattern: '0',
        parkCode: '',
        parkId: ''
      },
      totalCount: 0,
      tableData: [],
      cameraPatternList: [],
    };
  },
  props: {
    dialogVisible: Boolean,
  },
  computed: {
    ...vx.mapGetters(['parkLotObj']),
  },
  watch: {
    dialogVisible(val) {
      val &&
        this.$nextTick(() => {
          this.param = { ...this.param, cameraCode: '' };
          this.getUnbindList();
        });
    },
  },
  created() { },
  mounted() {
    this.cameraPatternList = this.$store.getters.dicList.CameraPattern;
  },
  methods: {
    getRowkeys(row) {
      return row.id;
    },
    handleSearchTabel() {
      this.param.current = 1;
      this.getUnbindList();
    },
    selectionChange(rows) {
      let selectedData = [];
      if (rows) {
        rows.forEach((row) => {
          if (row) {
            selectedData.push(row.cameraCode);
          }
        });
      }
      this.addParam.cameraCode = selectedData.join(',')
      console.log('sel', this.addParam.cameraCode);
    },
    getUnbindList() {
      api.getUnbindList(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
      });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.getUnbindList();
    },
    handleSizeChange(val) {
      this.param.current = 1;
      this.param.size = val;
      this.getUnbindList();
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    addData() {
      if (this.addParam.cameraCode == '') {
        this.$message.warning('请选中需要添加的相机')
        return false
      }
      this.sending = true;
      const { id, parkCode } = this.parkLotObj;
      this.addParam = {
        ...this.addParam,
        parkCode,
        parkId: id
      }
      api.addData(this.addParam).then(() => {
        this.$message.success('新增相机成功');
        this.$emit('update:dialogVisible', false);
        this.$emit('form-submit');
      })
        .finally(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less"></style>
