<template>
  <el-dialog class="hight-dialog"
             title="添加高位相机"
             :visible.sync="dialogVisible"
             width="800px"
             :before-close="handleClose">
    <el-form label-width="180px">
      <el-form-item label="选择添加后的相机模式：">
        <el-select v-model="cameraPattern"
                   placeholder="请选择">
          <el-option v-for="item in cameraPatternList"
                     :key="item.code"
                     :label="item.type"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="camera-list">
      <!-- <div class="camera-list-title font-14">关联相邻相机</div> -->
      <el-form :inline="true">
        <el-form-item label="相机编号：">
          <el-input v-model="param.cameraCode"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="medium"
                     @click="searchData">查询</el-button>
        </el-form-item>

      </el-form>
      <el-form>
        <el-form-item label="同步相机：">
          <el-button type="primary"
                     size="medium"
                     @click.native="addParams(item.code)"
                     v-for="item in cameraTypeList"
                     :key="item.code">{{item.type}}</el-button>

        </el-form-item>
      </el-form>
      <div class="">
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
          <el-table-column prop="cameraType"
                           label="设备类型"
                           min-width="100">
            <template slot-scope="scope">
              {{ mappingDic('CameraType', scope.row.cameraType) }}
            </template>
          </el-table-column>
          <el-table-column prop="cameraCode"
                           label="相机编号"
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
                 @click="handleAdd"
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
      cameraPattern: '1',
      cameraPatternList: [],
      rules: {},
      param: {
        cameraType: '0',
        cameraCode: '',
        parkId: '',
        current: 1,
        size: 5,
      },
      tableData: [],
      totalCount: 0,
      selectObj: {},
      cancelSelectObj: {},
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
          this.param.current = 1
          this.param.cameraType = '0'
          // const { id, parkCode } = this.$store.getters.parkLotObj;
          // this.param.parkId = id
          // this.param.cameraCode = 'CA12345435'
          // this.param.parkId = '1370980801046515714'
          this.searchData()
        });
    },
  },
  computed: {
    cameraTypeList() {
      return this.$store.state.dic.dicList.CameraType
    },
    ...vx.mapGetters(['parkLotObj']),
  },
  created() { },
  mounted() {
    this.cameraPatternList = this.$store.getters.dicList.CameraPattern;
  },

  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    handleAdd() {
      let select = []
      for (let key in this.selectObj) {
        select.push(this.selectObj[key])
      }
      if (!select.length) {
        this.$message.warning('请选中需要添加的相机')
        return false
      }
      let data = {
        cameraPattern: this.cameraPattern,
        parkCode: this.parkLotObj.parkCode,
        parkId: this.parkLotObj.id,
        cameraCode: select.join(',')
      }
      this.sending = true;
      api.addData(data)
        .then(() => {
          this.sending = false;
          this.$message.success('添加高位相机成功')
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
      // if (!this.selectType.length) {
      //   this.$message.error('请选择一个设备类型')
      //   return false
      // }
      // this.param.cameraType = this.selectType.length ? this.selectType.join(',') : ''
      api.getUnbindList(this.param).then((res) => {
        this.tableData = res.records;
        this.totalCount = res.total;
        this.$nextTick(() => {

          this.tableData.forEach((item => {
            for (let key in this.selectObj) {
              if (key && key == item.cameraCode) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            }
            // if (item.isAdjacentCamera) {
            //   this.$refs.multipleTable.toggleRowSelection(item, true)
            // }
          }))
        })
      });
    },
    // 单条选中
    handleSelectionChange(selection, row) {
      if (this.selectObj[row.cameraCode]) {
        delete this.selectObj[row.cameraCode]
      } else {
        this.selectObj[row.cameraCode] = row.cameraCode
      }
    },
    // 全部选中
    handleselectAll(selection, a) {
      this.tableData.forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(this.selectObj, row.cameraCode)) {
          delete this.selectObj[row.cameraCode]
        } else {
          this.selectObj[row.cameraCode] = row.cameraCode
        }

      });
    },
    // memoryChecked() {
    //   this.datalist.forEach((row, index) => {
    //     if (this.selectObj.hasOwnProperty(row.cameraCode)) {
    //       this.$refs.multipleTable.toggleRowSelection(row, true);
    //     } else {
    //       this.$refs.multipleTable.toggleRowSelection(row, false);
    //     }
    //   });
    // },
    addParams(code) {
      api.syncThirdPartyCameras({ cameraType: code, size: 5 }).then((res) => {
        console.log(res)
        if (res) {
          this.$message.success('同步第三方相机成功')
        } else {
          this.$message.success('同步第三方相机失败')
        }
        this.param.cameraType = code
        this.searchData()
      })
    }
  },
};
</script>
<style scoped lang="less">
.camera-list {
  padding-top: 24px;
  border-top: 1px solid #c0c4cc;
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
