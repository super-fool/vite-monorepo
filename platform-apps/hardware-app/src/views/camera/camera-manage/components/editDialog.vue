<template>
  <el-dialog class="view-dialog"
             title="编辑相机"
             :visible.sync="dialogVisible"
             width="720px"
             :before-close="handleClose">
    <el-form ref="editForm"
             label-position="left"
             :model="form"
             :rules="rules"
             label-width="110px">
      <el-form-item label="相机编号："
                    prop="tollmanName">
        {{form.cameraCode}}
      </el-form-item>
      <el-form-item label="相机模式："
                    prop="username">
        <el-select v-model="form.cameraPattern"
                   placeholder="请选择">
          <el-option v-for="item in cameraPatternList"
                     :key="item.code"
                     :label="item.type"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="camera-list">
      <div class="camera-list-title font-14">关联相邻相机</div>
      <el-form label-width="auto"
               inline>
        <el-form-item label="相机编号：">
          <el-input v-model="param.adjacentCameraCode"
                    placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="绑定路段：">
          <el-input v-model="param.roadName"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:30px">
          <el-button type="primary"
                     size="medium"
                     @click="searchData">查询</el-button>
        </el-form-item>

      </el-form>
      <div class="view-content-table">
        <el-table :data="tableData"
                  ref="multipleTable"
                  class="camera-table"
                  @select="handleSelectionChange"
                  @select-all="handleselectAll"
                  :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px',
            }"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="70">
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
                           min-width="100">
          </el-table-column>
          <el-table-column prop="roadName"
                           label="绑定路段"
                           min-width="170">
          </el-table-column>
        </el-table>
      </div>
      <el-pagination small
                     layout="prev, pager, next"
                     :page-size="param.size"
                     :current-page.sync="param.current"
                     :total="totalCount"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="handleUpdate"
                 :loading="sending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/cameraManage';
export default {
  data() {

    return {
      sending: false,
      form: {
        cameraCode: '',
        cameraPattern: null,
        parkCode: '',
        parkId: ''
      },
      cameraPatternList: [],
      rules: {},
      param: {
        adjacentCameraCode: '',
        roadName: '',
        cameraCode: '',
        parkId: '',
        current: 1,
        size: 10,
      },
      tableData: [],
      totalCount: 0,
      selectObj: {},
      cancelSelectObj: {}
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

          this.selectObj = {}
          this.cancelSelectObj = {}
          const { id, parkCode } = this.$store.getters.parkLotObj;
          const { cameraCode, cameraPattern } = this.dataItem;
          this.form = {
            cameraCode,
            cameraPattern: cameraPattern + '',
            parkCode,
            parkId: id
          };
          this.param.adjacentCameraCode = ''
          this.param.roadName = ''
          this.param.cameraCode = cameraCode
          this.param.parkId = id
          // this.param.cameraCode = 'CA12345435'
          // this.param.parkId = '1370980801046515714'
          this.searchData()
        });
    },
  },
  created() { },
  mounted() {
    this.cameraPatternList = this.$store.getters.dicList.CameraPattern;
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    handleUpdate() {
      this.sending = true;
      let select = []
      let cancel = []
      for (let key in this.selectObj) {
        select.push(this.selectObj[key])
      }
      for (let key in this.cancelSelectObj) {
        cancel.push(this.cancelSelectObj[key])
      }
      let data = { adjacentCameraCode: select, cancelAdjacentCameraCode: cancel, ...this.form }
      api.updateData(data)
        .then(() => {
          this.$message.success('编辑相机成功')
          this.$emit('update:dialogVisible', false);
          this.$emit('form-submit');
        })
        .then(() => {
          this.sending = false;
        });
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    searchData() {
      api.getCameraRoadsByQuery(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
        this.$nextTick(() => {
          this.tableData.forEach((item => {
            if (item.isAdjacentCamera) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
            for (let key in this.selectObj) {
              if (key && key == item.cameraCode) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            }
          }))
        })

      });
    },
    // 单条选中
    handleSelectionChange(selection, row) {
      console.log(selection)
      console.log(row)
      if (row.isAdjacentCamera) {
        if (this.cancelSelectObj[row.cameraCode]) {
          delete this.cancelSelectObj[row.cameraCode]
        } else {
          this.cancelSelectObj[row.cameraCode] = row.cameraCode
        }
      } else {
        if (this.selectObj[row.cameraCode]) {
          delete this.selectObj[row.cameraCode]
        } else {
          this.selectObj[row.cameraCode] = row.cameraCode
        }

      }
      // if (this.selectObj[row.cameraCode]) {
      //   delete this.selectObj[row.cameraCode]
      // } else {
      //   this.selectObj[row.cameraCode] = row.cameraCode
      // }
    },
    // 全部选中
    handleselectAll(selection, a) {
      console.log(selection)
      console.log(a)
      this.tableData.forEach((row) => {
        if (selection.length) {

          this.selectObj[row.cameraCode] = row.cameraCode
          this.cancelSelectObj = {}
        } else {

          this.cancelSelectObj[row.cameraCode] = row.cameraCode
          this.selectObj = {}
        }

      });
    },
    memoryChecked() {
      this.datalist.forEach((row, index) => {
        if (Object.prototype.hasOwnProperty.call(this.selectObj, row.cameraCode)) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.camera-list {
  padding-top: 24px;
  border-top: 1px solid #f7f7f7;
  &-title {
    color: #252525;
    line-height: 24px;
    margin-bottom: 24px;
  }
  .el-pagination--small {
    display: flex;
    justify-content: flex-end;
    padding: 12px 0;
  }
  .camera-table {
    height: 400px;
    overflow-y: scroll;
  }
}
.view-dialog .camera-list .el-input {
  width: 150px;
}
</style>
