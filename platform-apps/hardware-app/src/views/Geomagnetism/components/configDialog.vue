<template>
  <el-dialog class="view-dialog"
             title="地磁配置"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <el-form :inline="true"
             :model="formInline"
             ref="formInline"
             class="demo-form-inline"
             :rules="rules">

      <el-form-item label="地磁IMEI："
                    label-width="100px"
                    prop="id">
        <el-input v-model="formInline.id"
                  disabled></el-input>
        <!-- <el-button @click="reset">恢复默认</el-button> -->
      </el-form-item>
      <el-form-item label="扫描时间："
                    label-width="100px"
                    prop="scanTime">
        <el-input v-model="formInline.scanTime"></el-input>
        <span class="ml-5">ms</span>
      </el-form-item>
      <el-form-item label="灵敏度："
                    label-width="100px"
                    prop="sensitivity">
        <el-input v-model="formInline.sensitivity"></el-input>
      </el-form-item>
      <el-form-item label="采集次数："
                    label-width="100px"
                    prop="collecteCount">
        <el-input v-model="formInline.collecteCount"></el-input>
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
var validateTimes = (rule, value, callback) => {
  // value = value.trim();
  let reg = /^[1-9]{1,}[\d]*$/;
  if (value < 500 || value > 20000) {
    callback(
      new Error('请输入500-20000的正整数')
    );
  } else if (!reg.test(value)) {
    callback(
      new Error('请输入500-20000的正整数')
    );
  } else {
    callback();
  }
};
var validateDeg = (rule, value, callback) => {
  // value = value.trim();
  let reg = /^([1-9]{1,1}|10)$/;
  if (!reg.test(value)) {
    callback(
      new Error('输入1-10的正整数')
    );
  } else {
    callback();
  }
};
export default {
  props: {
    dialogVisible: Boolean,
    dataItem: Object
  },
  watch: {
    dataItem: {
      deep: true,
      handler(val) {
        console.log(val)
        this.formInline.scanTime = val.scanTime
        this.formInline.sensitivity = val.sensitivity
        this.formInline.collecteCount = val.collecteCount
        this.formInline.id = val.id
      }
    }
  },
  data() {
    return {
      formInline: {
        scanTime: '',
        id: '',
        sensitivity: '',
        collecteCount: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入IMEI', trigger: 'blur' },
        ],
        scanTime: [
          { required: true, message: '请输入扫描时间', trigger: 'blur' },
          { required: true, validator: validateTimes, trigger: 'blur' },
        ],
        sensitivity: [
          { required: true, message: '请输入灵敏度', trigger: 'blur' },
          { required: true, validator: validateDeg, trigger: 'blur' },
        ],
        collecteCount: [
          { required: true, message: '请输入采集次数', trigger: 'blur' },
          { required: true, validator: validateDeg, trigger: 'blur' },
        ]
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
      api.deviceConfiguration(this.formInline).then(res => {
        if (res) {
          this.$message.success('配置成功')
          this.handleClose()
          this.$emit('form-submit')
        }
      })
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    reset() {
      console.log(1111)
    }
  }
}
</script>

<style>
</style>