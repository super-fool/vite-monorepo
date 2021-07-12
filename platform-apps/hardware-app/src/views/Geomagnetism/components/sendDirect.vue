<template>
  <el-dialog class="view-dialog"
             title="下发指令"
             :visible.sync="dialogVisible"
             width="800px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <el-form :inline="true"
             :model="formInline"
             ref="formInline"
             class="demo-form-inline"
             :rules="rules">

      <el-form-item label="地磁IMEI："
                    label-width="120px"
                    prop="imei">
        <el-input v-model="formInline.imei"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="指令选择："
                    label-width="120px"
                    prop="times">
        <el-select v-model="direct"
                   @change="selectChange">
          <el-option v-for="item in defaultIssuedCommand"
                     :key="item.code"
                     :label="item.type"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指令下发内容："
                    label-width="120px"
                    prop="command">
        <el-input v-model="formInline.command"
                  type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div class="view-dialog-content flex-center mb-20">
      <el-button type="primary"
                 @click="send">下发指令</el-button>
    </div>
    <div class="view-content-table">
      <el-table :data="tableData"
                class="camera-table"
                :header-cell-style="{
              background: '#f5f5f5',
              'line-height': '36px',
            }"
                style="width: 100%">
        <el-table-column prop="source"
                         label="指令方式"
                         min-width="100">
          <template slot-scope="scope">
            {{ mappingDic('CommandMode', scope.row.source) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="下发/接收时间"
                         min-width="170">
        </el-table-column>
        <el-table-column prop="command"
                         label="指令内容"
                         min-width="170">
          <template slot-scope="scope">
            <span :title="scope.row.command">{{scope.row.command}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result"
                         label="处理结果"
                         min-width="170">
          <template slot-scope="scope">
            {{ mappingDic('PushResult', scope.row.result) }}
          </template>
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
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/geomagnetis.js';
// import * as vx from 'vuex';
export default {
  props: {
    dialogVisible: Boolean,
    dataItem: String
  },
  computed: {
    defaultIssuedCommand() {
      return [...this.$store.getters.dicList.DefaultIssuedCommand, { code: '', type: '自定义' }]
    }
  },
  data() {
    return {
      formInline: {
        command: "",
        imei: ''
      },
      rules: {
        imei: [
          { required: true, message: '请输入IMEI', trigger: 'blur' },
        ],
        command: [
          { required: true, message: '请输入指令内容', trigger: 'blur' },
        ]
      },
      tableData: [],
      totalCount: 0,
      param: {
        size: 5,
        current: 1,
        nbiotId: ''
      },
      direct: ''
    }
  },
  watch: {
    // dialogVisible(val) {
    //   val && (this.searchData(val))
    // },
    dataItem: {
      deep: true,
      handler(val) {
        this.formInline.imei = val.imei
        this.param.nbiotId = val.id
        this.searchData()
      }
    }
  },
  methods: {
    submitForm() { },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    handleCurrentChange(val) {
      this.param.current = val;
      this.searchData();
    },
    searchData() {
      api.querylogData(this.param).then(res => {
        this.tableData = res.records;
        this.totalCount = res.total;
      })
    },
    selectChange(val) {
      this.formInline.command = val
    },
    send() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          let data = {
            imei: this.formInline.imei.split(),
            command: this.formInline.command
          }
          api.sendInstructions(data).then(res => {
            if (res) {
              this.$message.success('发送指令成功')
              this.handleClose()
            }
          })
        }
      })

    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .view-content-table {
  .el-table .cell {
    white-space: nowrap;
  }
}
</style>