<template>
  <el-dialog class="view-dialog"
             title="修改密码"
             :visible.sync="dialogVisible"
             :before-close="handleClose"
             width="520px">
    <div class="pwd-change">
      <el-form class="form"
               :model="form"
               :rules="rules"
               ref="form"
               label-width="140px">
        <el-form-item prop="password"
                      label="原密码：">
          <el-input placeholder="原密码"
                    type="password"
                    v-model="form.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword"
                      label="新密码：">
          <el-input :placeholder="'新密码应为8-20位，且必须包含字母和数字，可包含._~!@$&*'"
                    type="password"
                    v-model="form.newPassword"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword"
                      label="再次输入新密码：">
          <el-input placeholder="再次输入新密码"
                    type="password"
                    v-model="form.confirmPassword"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
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
import { updatePassword } from '@/api/login';
import * as vx from 'vuex';
export default {
  data() {
    var validatePwd = (rule, value, callback) => {
      value = value.trim();
      let reg = /^(?=.*[a-z+A-Z])(?=.*[0-9])[A-Za-z0-9._~!@$&*]{8,20}$/;
      if (!reg.test(value)) {
        callback(
          new Error('新密码应为8-20位，且必须包含字母和数字，可包含._~!@$&*')
        );
      } else if (
        this.form.newPassword &&
        this.form.confirmPassword &&
        this.form.newPassword !== this.form.confirmPassword
      ) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      sending: false,
      form: {
        username: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { required: true, validator: validatePwd, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { required: true, validator: validatePwd, trigger: 'blur' },
        ],
      },
    };
  },
  props: {
    dialogVisible: Boolean,
  },
  computed: {
    ...vx.mapGetters(['userInfo']),
  },
  created() { },
  mounted() {
    this.form.username = this.userInfo.username;
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updatePassword();
        }
      });
    },
    updatePassword() {
      this.sending = true;
      updatePassword(this.form)
        .then(() => {
          this.$message.success('修改密码成功');
          this.handleClose();
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less">
.pwd-change {
  .form {
    width: 100%;
  }
}
</style>
