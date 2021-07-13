<template>
  <div class="park-lot-select">
    <div class="title">请选择车场</div>
    <div class="select-box">
      <el-select v-model="parkId" size="large" placeholder="请选择">
        <el-option
          v-for="item in parkLotOptions"
          :key="item.id"
          :label="item.parkName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <el-button type="primary" class="l-confirm-btn" @click="parkLotHandel"
      >确定</el-button
    >
  </div>
</template>

<script>
import { getUserParking, selectParking } from "@/api/login";
export default {
  data() {
    return {
      parkId: "",
      parkLotOptions: []
    };
  },
  created() {},
  mounted() {
    this.getUserParking();
  },
  methods: {
    getUserParking() {
      getUserParking().then((data) => {
        const { parkings, lastSelectParkId } = data;
        const idArr = parkings.map((val) => val.id);
        this.parkLotOptions = parkings;
        this.parkId = idArr.includes(lastSelectParkId)
          ? lastSelectParkId
          : parkings[0].id;
        this.saveParkLot(this.parkId);
      });
    },
    parkLotHandel() {
      selectParking({
        parkId: this.parkId
      }).then(() => {
        this.saveParkLot(this.parkId);
        this.$router.push({
          name: "CameraManage"
        });
      });
    },
    saveParkLot(id) {
      let item = this.parkLotOptions.filter((v) => v.id === id);
      this.$store.dispatch("user/setParkLot", { ...item[0], isloginSet: true });
    }
  }
};
</script>
<style scoped lang="less">
.park-lot-select {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 608px;
  height: 420px;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 5px;
  background: #ffffff;
  overflow: hidden;
  .title {
    line-height: 80px;
    text-align: center;
    font-size: 24px;
    color: #000000;
    font-weight: bold;
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
    font-size: 18px;
    letter-spacing: 5px;
  }
}
</style>
