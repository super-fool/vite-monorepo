<template>
  <div class="pwd-change">
    <div class="title">修改密码</div>
    <el-form class="form"
             :model="form"
             :rules="rules"
             ref="form"
             label-width="140px">
      <el-form-item prop="password"
                    label="原密码：">
        <el-input size="large"
                  type="password"
                  placeholder="原密码"
                  v-model="form.password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="newPassword"
                    label="新密码：">
        <el-input size="large"
                  :placeholder="'新密码应为8-20位，且必须包含字母和数字，可包含._~!@$&*'"
                  type="password"
                  v-model="form.newPassword"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword"
                    label="再次输入新密码：">
        <el-input size="large"
                  type="password"
                  placeholder="再次输入新密码"
                  v-model="form.confirmPassword"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:50px;">
        <el-button type="primary"
                   class="l-confirm-btn"
                   @click="submitForm">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/login';
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
  props: ['name'],
  created() { },
  mounted() {
    this.form.username = this.name;
  },
  methods: {
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.updatePassword();
        }
      });
    },
    updatePassword() {
      updatePassword(this.form).then(() => {
        this.$emit('success');
      });
    },
  },
};
</script>
<style scoped lang="less">
.pwd-change {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 628px;
  height: 404px;
  box-sizing: border-box;
  padding: 0 20px;
  border-radius: 5px;
  background: #ffffff;
  overflow: hidden;
  .title {
    line-height: 80px;
    text-align: left;
    font-size: 24px;
    color: #000000;
    font-weight: bold;
  }
  .form {
    width: 90%;
    margin: 10px auto;
  }
}
</style>
