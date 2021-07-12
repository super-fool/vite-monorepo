<template>
  <div class="login-wrap">
    <div class="system-name" v-if="step === 1">
      <p v-if="configData.systemGroupName">{{ configData.systemGroupName }}</p>
      <p :style="{ lineHeight: configData.systemGroupName ? '90px' : '180px' }">
        硬件云平台
      </p>
    </div>
    <div class="user-login part-item" v-if="step === 1">
      <div class="title">欢迎登录硬件云平台</div>
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="0"
      >
        <el-form-item prop="username">
          <el-input
            size="large"
            placeholder="登录账号（手机号）"
            prefix-icon="iconfont iconzhanghao"
            v-model.trim="loginForm.username"
            autocomplete="off"
            @keyup.enter.native="submitForm"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="large"
            prefix-icon="iconfont iconmima"
            :type="isPwdSee ? 'text' : 'password'"
            placeholder="登录密码"
            v-model.trim="loginForm.password"
            autocomplete="off"
            @keyup.enter.native="submitForm"
          >
            <i
              slot="suffix"
              style="cursor: pointer"
              class="iconfont"
              @click="isPwdSee = !isPwdSee"
              :class="isPwdSee ? 'iconxianshi' : 'iconyincang'"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="check-code">
            <el-input
              size="large"
              prefix-icon="iconfont iconyanzhengma"
              style="width: 80%"
              placeholder="验证码"
              v-model.trim="loginForm.code"
              autocomplete="off"
              @keyup.enter.native="submitForm"
            ></el-input>
            <el-image
              @click.native="getCheckCode"
              style="width: 60px"
              :src="codeUrl"
            ></el-image>
          </div>
        </el-form-item>
        <el-checkbox v-model="isSaveName">记住账号</el-checkbox>
        <el-form-item prop="checkPass"> </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            class="l-confirm-btn"
            @click="submitForm"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <PwdChange
      v-else-if="step === 2"
      :name="loginForm.username"
      @success="updatePwdSuccess"
    ></PwdChange>
    <ParkingLotSelect v-else-if="step === 3"></ParkingLotSelect>
  </div>
</template>

<script>
import PwdChange from "./components/PwdChange.vue";
import ParkingLotSelect from "./components/ParkingLotSelect.vue";
import {
  getCheckCode,
  authLogin,
  getUserInfo,
  queryUserDataByToken,
} from "@/api/login";
import { getConfig } from "@/api/dic";
export default {
  components: { PwdChange, ParkingLotSelect },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      step: 1,
      isPwdSee: false,
      isSaveName: false,
      loginSuccess: false,
      codeUrl: "",
      configData: {},
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  created() {
    // if (window.localStorage.getItem("username")) {
    //   this.loginForm.username = window.localStorage.getItem("username");
    //   this.isSaveName = true;
    // }
  },
  mounted() {
    // this.getCheckCode();
    // this.getConfig();
  },
  // methods: {
  //   getConfig() {
  //     getConfig().then((res) => {
  //       this.configData = res;
  //     });
  //   },
  //   getCheckCode() {
  //     getCheckCode().then((data) => {
  //       const { img, uuid } = data;
  //       this.codeUrl = "data:image/jpg;base64," + img;
  //       this.loginForm.uuid = uuid;
  //     });
  //   },
  //   submitForm() {
  //     console.log(this.loginForm);
  //     this.$refs["loginForm"].validate((valid) => {
  //       if (valid) {
  //         this.loginHandel();
  //       }
  //     });
  //   },
  //   loginHandel() {
  //     authLogin(this.loginForm)
  //       .then((data) => {
  //         //this.$message.success('登录成功');
  //         console.log(data);
  //         this.loginSuccess = true;
  //         const { token, user, firstLogin } = data;
  //         this.$store.dispatch("user/setUserInfo", user);
  //         window.localStorage.setItem("hcpToken", token);
  //         if (firstLogin) {
  //           this.step = 2;
  //         } else if (user.user.adminFlag) {
  //           this.$router.push("/MenuManage");
  //         } else {
  //           this.step = 3;
  //         }
  //       })
  //       .finally(() => {
  //         if (this.isSaveName) {
  //           window.localStorage.setItem("username", this.loginForm.username);
  //         } else {
  //           window.localStorage.getItem("username") &&
  //             localStorage.removeItem("username");
  //         }
  //         console.log(this.loginSuccess);
  //         !this.loginSuccess && this.getCheckCode();
  //         this.loginForm.code = "";
  //       });
  //   },
  //   updatePwdSuccess() {
  //     this.step = 3;
  //   },
  //   getUserInfo() {
  //     getUserInfo().then((data) => {
  //       console.log(data);
  //     });
  //   },
  // },
};
</script>

<style lang="less">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url(../../assets/image/login-bg.png);
}
.system-name {
  position: absolute;
  left: 10%;
  top: 0;
  bottom: 0;
  text-align: left;
  height: 300px;
  margin: auto;
  font-size: 65px;
  letter-spacing: 5px;
  color: #ffffff;
  font-weight: bold;
  //line-height: 90px;
  box-sizing: border-box;
  padding: 60px 80px;
  background-image: url(../../assets/image/bg-left.png),
    url(../../assets/image/bg-left1.png), url(../../assets/image/bg-right.png),
    url(../../assets/image/bg-right1.png);
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
  background-size: 56px, 56px, 56px, 56px;
  background-position: left top, left bottom, right top, right bottom;
}
.part-item {
  position: absolute;
  right: 10%;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 470px;
  height: 500px;
  box-sizing: border-box;
  padding: 40px 20px;
  border-radius: 5px;
  background: #ffffff;
  overflow: hidden;
  .title {
    padding-left: 50px;
    line-height: 80px;
    text-align: left;
    font-size: 24px;
    color: #000000;
    font-weight: bold;
  }
}
.login-form {
  width: 80%;
  margin: 10px auto;
  .check-code {
    display: flex;
    justify-content: space-between;
  }
  .el-image {
    width: 60px;
    border: 1px solid #d9d9d9;
    margin-left: 10px;
  }
}
.park-lot-select {
  height: 320px;
  .select-box {
    width: 60%;
    margin: 10px auto;
    .el-select {
      width: 100%;
    }
  }
  .el-button {
    width: 60%;
    margin: 30px 20% 0;
  }
}
.l-confirm-btn {
  width: 100%;
  height: 50px;
  font-size: 18px;
  letter-spacing: 5px;
}
@media screen and (min-width: 2500px) {
  .system-name {
    left: 25%;
  }
  .part-item {
    right: 25%;
  }
}
@media screen and (min-width: 2000px) and (max-width: 2500px) {
  .system-name {
    left: 15%;
  }
  .part-item {
    right: 15%;
  }
}
@media screen and (min-width: 1400px) and (max-width: 1700px) {
  .system-name {
    font-size: 60px;
    padding: 60px 80px;
  }
  .part-item {
    right: 150px;
  }
}
@media screen and (min-width: 1171px) and (max-width: 1400px) {
  .system-name {
    left: 80px;
    padding: 60px 40px;
    font-size: 55px;
  }
  .part-item {
    right: 120px;
  }
}
@media screen and (max-width: 1170px) {
  .system-name {
    display: none;
  }
  .part-item {
    left: 0;
    right: 0;
  }
}
</style>
