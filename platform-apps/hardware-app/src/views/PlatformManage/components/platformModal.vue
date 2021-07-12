<template>
  <el-dialog class="view-dialog"
             :title="dataItem ? '编辑平台' : '添加平台'"
             :visible.sync="dialogVisible"
             width="580px"
             :before-close="handleClose">
    <el-form ref="editForm"
             label-position="left"
             :model="form"
             :rules="rules"
             label-width="120px">
      <el-form-item label="平台名称："
                    prop="serverName">
        <el-input v-model="form.serverName"
                  maxlength="128"
                  placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="平台地址(url)："
                    prop="url">
        <el-input v-model="form.url"
                  placeholder="请输入"
                  maxlength="128"
                  show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm"
                 :loading="sending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data';
import * as api from '@/api/plateformManage';
export default {
  data() {
    // const validateStcId = (rule, value, callback) => {
    //   api.exist({ stcId: value }).then((res) => {
    //     if (res.isExist && res.id !== this.form.id)
    //       callback(new Error('该ID已存在'));
    //     else callback();
    //   });
    // };
    // const validateParkName = (rule, value, callback) => {
    //   api.exist({ parkName: value }).then((res) => {
    //     if (res.isExist && res.id !== this.form.id)
    //       callback(new Error('该车场名称已存在'));
    //     else callback();
    //   });
    // };
    return {
      regionData: regionData,
      sending: false,
      form: {
        id: '',
        serverName: '',
        url: ''
      },
      rules: {
        serverName: [
          { required: true, message: '请输入平台名称', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入平台地址', trigger: 'blur' },
          // { required: true, validator: validateParkName, trigger: 'blur' },
        ],
      },
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
          this.$refs.editForm && this.$refs.editForm.clearValidate();
          this.$refs.editForm && this.$refs.editForm.resetFields();
          if (!this.dataItem) return;
          const {
            id,
            serverName,
            url
          } = this.dataItem;

          Object.assign(this.form, {
            id,
            serverName,
            url
          });
        });
    },
  },
  created() { },
  mounted() { },
  methods: {
    handleChange(value) {
      value.forEach((item, index) => {
        if (index === 0) {
          this.form.provinceCode = item;
          this.form.province = CodeToText[item];
        } else if (index === 1) {
          this.form.cityCode = item;
          this.form.city = CodeToText[item];
        } else if (index === 2) {
          this.form.districtCode = item;
          this.form.district = CodeToText[item];
        }
      });
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.handleUpdate();
      });
    },
    handleUpdate() {
      this.sending = true;
      const func = this.dataItem ? 'editData' : 'addData';
      const data = JSON.parse(JSON.stringify(this.form));
      delete data.selectedAddress;
      !this.dataItem && (data.id = '')
      api[func](data)
        .then(() => {
          this.sending = false
          this.dataItem
            ? this.$message.success('编辑平台成功')
            : this.$message.success('新增平台成功');
          this.$emit('update:dialogVisible', false);
          this.$emit('form-submit');
        })
        .catch(() => {
        }).then(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less"></style>
