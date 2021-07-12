<template>
  <el-dialog class="view-dialog"
             title="批量发送指令"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <el-form :inline="true"
             :model="formInline"
             ref="formInline"
             class="demo-form-inline"
             :rules="rules">
      <el-form-item label="批量下发指令的地磁数量："
                    label-width="200px"
                    prop="IMEI">
        <el-input v-model="count"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="指令选择："
                    label-width="200px"
                    prop="times">
        <el-select v-model="direct"
                   @change="selectChange">
          <el-option v-for="item in defaultIssuedCommand"
                     :key="item.code"
                     :label="item.type"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下发指令内容："
                    label-width="200px"
                    prop="command">
        <el-input type="textarea"
                  v-model="formInline.command"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/geomagnetis.js';
// import * as vx from 'vuex';
export default {
  props: {
    dialogVisible: Boolean,
    list: Array
  },
  computed: {
    defaultIssuedCommand() {
      return [...this.$store.getters.dicList.DefaultIssuedCommand, { code: '', type: '自定义' }]
    },
    count() {
      return this.formInline.imei.length
    }
  },
  data() {
    return {
      formInline: {
        imei: [],
        command: ''
      },
      direct: '',
      rules: {
        command: [
          { required: true, message: '请输入下发指令内容', trigger: 'blur' },
        ]
      }
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        if (val.length) {
          val.forEach(item => {
            this.formInline.imei.push(item.imei)
          })
        }
      }
    },
    dialogVisible(val) {
      val && (this.formInline.resetFields())
    }
  },
  methods: {
    submitForm() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          this.sendData();
        }
      })
    },
    sendData() {
      let data = {
        imei: this.formInline.imei,
        // command: 'dsdsf234234'
        command: this.formInline.command
      }
      api.sendInstructions(data).then(res => {
        if (res) {
          this.$message.success('批量添加成功')
          this.handleClose()
          this.$emit('form-submit')
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    selectChange(val) {
      this.formInline.command = val
    },
    searchData() { },
    send() { }
  }
}
</script>

<style lang="less" scoped>
</style>