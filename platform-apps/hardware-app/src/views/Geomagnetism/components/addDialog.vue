<template>
  <el-dialog class="view-dialog"
             title="添加地磁"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <el-form :inline="true"
             :model="formInline"
             class="demo-form-inline"
             ref="formInline"
             :rules="rules">
      <el-form-item label="运营商："
                    prop="iot"
                    label-width="100px">
        <el-select v-model="formInline.iot">
          <el-option v-for="item in dicList.IotService"
                     :key="item.code"
                     :label="item.type"
                     :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IMEI："
                    label-width="100px"
                    prop="imei">
        <el-input v-model="formInline.imei"></el-input>
      </el-form-item>
      <el-form-item label="IMSI："
                    label-width="100px">
        <el-input v-model="formInline.imsi"></el-input>
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
import * as vx from 'vuex';
export default {
  props: {
    dialogVisible: Boolean,
  },
  computed: {
    ...vx.mapGetters(['dicList']),
  },
  data() {
    return {
      formInline: {
        iot: "",
        imei: "",
        imsi: ""
      },
      rules: {
        imei: [
          { required: true, message: '请输入IMEI', trigger: 'blur' },
        ],
        iot: [
          { required: true, message: '请选择运营商', trigger: 'blur' },
        ],
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.formInline.iot = 'onenet'
        this.formInline.imei = ''
        this.formInline.imsi = ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          this.addData();
        }
      })
    },
    addData() {
      this.formInline.parkingId = this.$store.getters.userParkId
      api.addData(this.formInline).then(res => {
        if (res) {
          this.$message.success('添加地磁成功')
          this.handleClose()
          this.$emit('form-submit')
        }
      })
    },
    downloadMes() {
      console.log('down')
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
  }
}
</script>

<style>
</style>