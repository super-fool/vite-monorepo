<template>
  <div class="view-content-table">
    <h3 class="config-til">{{ title }}</h3>
    <el-table class="config-table"
              :data="tableData"
              :span-method="cellMerge"
              border
              style="width: 100%">
      <el-table-column label="是否开启"
                       width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.strategyType == 3">开启</span>
          <el-switch v-else
                     v-model="scope.row.isEnable"
                     @change="switchChange(scope.row.strategyCode, scope.row.isEnable)"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="策略"
                       prop="strategyName"
                       min-width="200"
                       align="center">
      </el-table-column>
      <el-table-column label="内容配置"
                       width="300">
        <template slot-scope="scope">
          <el-form v-if="
              scope.row.configValue"
                   :model="scope.row"
                   :rules="checkParamsRule"
                   :ref="'configValue' + scope.$index"
                   :inline="false">
            <el-form-item prop="configValue"
                          style="margin-bottom:0">
              {{ scope.row.strategyConfig }}
              <el-input-number style="width:100px"
                               controls-position="right"
                               v-model="scope.row.configValue"
                               @blur="
                  configValueChange(
                    scope.row.strategyCode,
                    scope.row.configValue
                  )
                "
                               size="mini"
                               :min="0"
                               :max="100"
                               :step="0.5"></el-input-number>
              小时
            </el-form-item>
          </el-form>
          <div v-else>{{ scope.row.strategyConfig }}</div>
        </template>
      </el-table-column>
      <el-table-column label="结果选择"
                       min-width="250"
                       align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.handleType"
                     placeholder="请选择">
            <el-option size="mini"
                       v-for="item in resultOptions"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    const validateCount = (rule, value, callback) => {
      if (/(^\d+$)|(^\d+\.\d+$)/.test(value)) {
        if (value > 100) {
          callback(new Error('不能大于100'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请输入0或者正数'));
      }
    };
    return {
      tableData: [],
      delivery: true,
      input: '',
      resultOptions: [],
      value: '',
      spanArr: [],
      checkParamsRule: {
        configValue: [
          { required: true, validator: validateCount, trigger: 'blur' }
        ]
      }
    };
  },
  props: ['data', 'title'],
  watch: {
    data: {
      deep: true,
      handler: function(val) {
        if (val) {
          this.tableData = val
          // this.tableData = JSON.parse(JSON.stringify(this.data));
          this.getSpanArr(this.tableData);
        }
      }
    }
  },
  created() { },
  mounted() {
    this.resultOptions = this.$store.getters.dicList.CameraPatrolStatus;
  },
  methods: {
    validateForm() {
      let flag = true;
      this.tableData.forEach((item, index) => {
        if (this.$refs['configValue' + index]) {
          this.$refs['configValue' + index].validate((valid) => {
            if (valid) {
              //alert('submit!');
            } else {
              flag = false;
            }
          });
        }
      });
      return flag;
    },
    switchChange(strategyCode, val) {
      this.tableData.forEach((item) => {
        if (item.strategyCode == strategyCode) {
          item.isEnable = val;
        }
      });
    },
    configValueChange(strategyCode, val) {
      this.tableData.forEach((item) => {
        if (item.strategyCode == strategyCode) {
          item.configValue = val;
        }
      });
    },
    getSpanArr(data) {
      let pos = 0;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].strategyName === data[i - 1].strategyName) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
      //console.log(this.spanArr);
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //用于设置要合并的列
      if (columnIndex === 0 || columnIndex === 1) {
        //用于设置合并开始的行号
        if (rowIndex % 2 === 0) {
          return {
            //合并的行数
            rowspan: 2,
            //合并的列数，设为０则直接不显示
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
<style lang="less">
.config-til {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  height: 35px;
  line-height: 35px;
}
.config-table {
  .el-form-item__error {
    z-index: 99;
    left: 185px;
    top: auto;
    bottom: 10px;
  }
}
</style>
