<template>
  <div class="site-detail">
    <div class="w-100" v-if="cameraCode.length">
      <div class="site-detail-content">
        <div class="site-detail-content-top">
          <div class="site-detail-content-top-button">
            <span :class="{ active: !activeTab }" @click="changeTab(0)"
              >入车图片</span
            >
            <span :class="{ active: activeTab }" @click="changeTab(1)"
              >秒图</span
            >
          </div>
          <div class="img-container" v-show="!activeTab">
            <imgBox :imgUrl="imgUrl"></imgBox>
            <div class="site-detail-content-bottom" v-if="infoData.imgs">
              <div
                class="site-detail-content-bottom-item"
                :class="{ active: item.imageUrl == imgUrl }"
                @mouseenter="changeImg(item)"
                v-for="(item, key) in infoData.imgs"
                :key="key"
              >
                <img :src="item.imageUrl" alt="" />
                <span>{{ item.imageTime }}</span>
              </div>
            </div>
          </div>
          <div class="sec-img-container" v-show="activeTab">
            <div class="sec-img-container-top">
              <imgBox
                :imgUrl="imgUrlSec1.imageUrl"
                :time="imgUrlSec1.imageTime"
              ></imgBox>
              <imgBox
                :imgUrl="imgUrlSec2.imageUrl"
                :time="imgUrlSec2.imageTime"
              ></imgBox>
            </div>
            <div class="time-tips mb-10 font-12">
              <span>昨天</span>
              <span>今天</span>
            </div>
            <div class="flex mb-10">
              <span class="font-12 mr-20 lh-38">小时轴</span>
              <el-slider
                v-model="timePointer"
                :min="startPoint"
                :max="endPoint"
                :step="1"
                show-input
                :format-tooltip="formatTooltip"
                @change="slideChange"
                :marks="marks"
                class="w-95"
              >
              </el-slider>
            </div>
            <div v-if="startMinu" class="flex">
              <span class="font-12 mr-20 lh-38">分钟轴</span>
              <el-slider
                v-model="minutePointer"
                :min="startPointMinu"
                :max="endPointMinu"
                :step="1"
                :format-tooltip="formatTooltipMinu"
                @change="slideChangeMinu"
                :marks="marksMinu"
                class="w-95"
              >
              </el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="site-detail-side">
        <div class="site-detail-side-header">
          <div class="site-detail-side-header-top">
            <div class="button check mr-10">巡检</div>
            <div class="button count-time">
              <span class="mr-5">倒计时</span>
              <count-down
                class="count-down"
                v-on:end_callback="countDownEnd()"
                :secondsTxt="''"
                :startTime="startTime"
                :endTime="endTime"
              ></count-down>
            </div>
            <div class="exsit" @click="handleQuit"></div>
          </div>
          <div class="site-detail-side-header-center">
            <div class="site-detail-side-header-center-item">
              <span class="site-detail-side-header-center-item-title"
                >相机编号：</span
              >
              <span class="site-detail-side-header-center-item-title">{{
                cameraCode
              }}</span>
            </div>
            <div class="site-detail-side-header-center-item">
              <span class="site-detail-side-header-center-item-title"
                >测试路段：</span
              >
              <span class="site-detail-side-header-center-item-title"
                >（{{ bindingRoadAndSpace }}）</span
              >
            </div>
            <div class="site-detail-side-header-center-item">
              <span class="site-detail-side-header-center-item-title"
                >区域状态：</span
              >
              <span
                class="site-detail-side-header-center-item-title"
                :class="{ red: !remainParkspace, green: remainParkspace }"
                >{{
                  remainParkspace ? "有" + remainParkspace + "个空车位" : "已满"
                }}</span
              >
            </div>
          </div>
          <div class="site-detail-side-header-bottom">
            <div class="site-detail-side-header-bottom-tab">
              <span :class="{ active: !inPlace }" @click="changeTab2(0)"
                >在场车辆</span
              >
              <span :class="{ active: inPlace }" @click="changeTab2(1)"
                >新增入车</span
              >
            </div>
            <div class="site-detail-side-header-bottom-left" v-show="!inPlace">
              <div class="clear">
                <div
                  class="site-detail-side-header-bottom-left-plate"
                  v-for="(item, key) in dataPool"
                  :key="key"
                >
                  <div
                    :class="{
                      select: seleteCar == item.carNo && item.clickAble,
                      disable: !item.clickAble,
                    }"
                    @click="selectCarNo(item, key)"
                  >
                    {{ item.carNo }}
                  </div>
                </div>
              </div>
              <div class="site-detail-side-header-bottom-input">
                <span>入车时间：</span>
                <span>{{ infoData.inTime }}</span>
              </div>
              <div class="site-detail-side-header-bottom-input">
                <span>出车时间：</span>
                <el-date-picker
                  v-model="businessTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="选择出车时间"
                />
              </div>
              <div class="site-detail-side-header-bottom-input">
                <span>修改车牌：</span>
                <PlateNumberQuery :plate-number.sync="pushPlateNum" />
              </div>
              <div class="site-detail-side-header-bottom-left-button">
                <!-- 迭代: 1053720 -->
                <div class="blue" style="display: none" @click="comfirmPlace">
                  仍在场
                </div>
                <div class="button-blue" @click="outCar">出车</div>
              </div>
            </div>
            <div class="site-detail-side-header-bottom-right" v-show="inPlace">
              <div class="site-detail-side-header-bottom-input">
                <span>入车时间：</span>
                <el-date-picker
                  v-model="businessTimeIn"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="选择入车时间"
                >
                </el-date-picker>
              </div>
              <div class="site-detail-side-header-bottom-input">
                <span>修改车牌：</span>
                <PlateNumberQuery :plate-number.sync="pushPlateNumIn" />
              </div>
              <div class="site-detail-side-header-bottom-left-button">
                <div class="button-blue" @click="enterCar">入车</div>
              </div>
            </div>
          </div>
          <div class="border-line"></div>
          <div
            class="site-detail-side-header-complte button-blue"
            @click="handleQuit"
          >
            完成巡检
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="!cameraCode.length && continuousAudit"
         class="no-data">暂无数据</div> -->
    <div
      v-if="!cameraCode.length && !continuousAudit"
      class="site-detail-waite"
    >
      <div class="site-detail-waite">待审核事件数量：{{ waiteCount }}</div>
      <el-button @click="checkAuditStatus">点击进入审核</el-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import imgBox from "./components/imgBox.vue";
import CountDown from "vue2-countdown";
import * as api from "@/api/audit";
import PlateNumberQuery from "@/components/PlateNumberQuery";
function addZero(s) {
  return s < 10 ? "0" + s : s;
}
export default {
  data() {
    return {
      pushPlateNum: "",
      pushPlateNumIn: "",
      activeTab: 1, // 0 入车图片 1 秒图
      continuousAudit: true,
      // imgUrl: 'https://n.sinaimg.cn/spider202141/436/w793h443/20210401/f899-knaqvqp0947138.jpg',
      imgUrl: "",
      showSetting: false,
      auditModalVisible: false,
      confuseModalVisible: false,
      cameraCode: "",
      auditStatus: null,
      timer: null,
      remark: "",
      startTime: new Date().getTime(),
      endTime: new Date().getTime() + 1000 * 60 * 10,
      infoData: {},
      showInterVal: false,
      waiteCount: 0,
      inPlace: 0,
      outTime: "",
      businessTime: this.$moment().valueOf(),
      businessTimeIn: this.$moment().valueOf(),
      value2: "",
      timePointer: 0,
      minutePointer: 0,
      startPoint: 0,
      endPoint: 24,
      startPointMinu: 0,
      endPointMinu: 12,
      startMinu: null,
      endMinu: null,
      startSec: null,
      endSec: null,
      nowTime: null,
      marks: {
        0: "16:00",
        288: "15:59",
      },
      marksMinu: {},
      remainParkspace: 0,
      bindingRoadAndSpace: "",
      dataPool: [],
      seleteCar: "",
      selectIndex: 0,
      imgUrlSec1: {
        imageUrl: "",
        createTime: "",
      },
      imgUrlSec2: {
        imageUrl: "",
        createTime: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        // selectableRange:`00:00:00 - ${addZero(new Date().getHours())+':'+ addZero(new Date().getMinutes())+ ':'+ addZero(new Date().getSeconds())}`
      },
    };
  },
  async created() {
    this.enterPatrolAudit(
      this.$route.query.cameraCode,
      this.$route.query.areaIndex
    );
    this.cameraCode = this.$route.query.cameraCode;
    this.areaIndex = this.$route.query.areaIndex;
    this.getSecondImg({
      cameraCode: this.cameraCode,
      time: this.$moment().valueOf(),
    });
    // if (this.$route.query.id) {
    //   // 单条审核跳转过来的
    //   this.enterPatrolAudit(this.$route.query.cameraCode, this.$route.query.areaIndex);
    // } else {
    //   await this.checkAuditStatus();
    // }
  },
  beforeDestroy() {
    // clearInterval(this.timer);
  },
  components: {
    imgBox,
    CountDown,
    PlateNumberQuery,
  },
  methods: {
    checkAuditStatus() {
      let data = {
        parkId: this.$route.parkId
          ? this.$route.parkId
          : this.$store.getters.userParkId,
      };
      // let data = { parkId: '1346766821899620353' }
      return api.checkAuditStatus(data).then((data) => {
        this.cameraCode = (data && data.cameraCode) || "";
        this.auditStatus = data && data.auditStatus;
        this.setLiveItem(this.cameraCode);
        if (this.cameraCode) {
          this.auditSequenceNextOne();
          // this.enterPatrolAudit(data.id)
        } else {
          this.timer = setInterval(() => {
            this.queryNewAuditEvent();
          }, 6000);
        }
      });
    },
    auditSequenceNextOne() {
      let data = {
        parkId: this.$route.parkId
          ? this.$route.parkId
          : this.$store.getters.userParkId,
      };
      api.auditSequenceNextOne(data).then((data) => {
        this.setData(data);
      });
    },
    queryNewAuditEvent() {
      // let data = {cameraCode:this.cameraCode}
      api.queryNewAuditEvent({}).then((data) => {
        if (data.parkId && !this.showInterVal) {
          this.showInterVal = true;
          this.$confirm("当前有新的待审核事件，是否进行审核？", "审核提醒", {
            confirmButtonText: "审核",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.showInterVal = false;
              clearInterval(this.timer);
              // 查看是否有待审核事件
              this.enterPatrolAudit(data.id, data.parkId);
            })
            .catch(() => {
              this.showInterVal = false;
            });
        }
      });
    },
    handleClick(val) {
      this.continuousAudit = val;
    },
    settingHandle() {
      this.showSetting = !this.showSetting;
    },
    changeTab(v) {
      this.activeTab = v;
    },
    changeTab2(v) {
      this.inPlace = v;
    },
    changeImg(item) {
      this.imgUrl = item.imageUrl;
    },
    chooseArea() {
      this.auditModalVisible = true;
    },
    confuseAuditHandle() {
      this.confuseModalVisible = true;
    },
    countDownEnd() {
      this.$alert("您已超时，可退出巡检后再次进去巡检", "超时提醒", {
        // confirmButtonText: '继续下一条',
        cancelButtonText: "退出巡检",
        callback: () => {
          this.quitDetail();
        },
      });
    },

    handleQuit() {
      // let data = { id: this.infoData.id };
      // api.handleQuit(data).then(() => {
      //   //  关闭详情页
      //   this.quitDetail();
      // });
      this.quitDetail();
    },
    handleAgent(status) {
      let data = {
        auditResult: status,
        pushPlateNum: this.pushPlateNum
          ? this.pushPlateNum
          : this.infoData.pushPlateNum,
        remark: this.remark,
        id: this.infoData.id,
      };
      api.handleAgent(data).then(() => {
        this.cameraCode = "";
        if (this.continuousAudit) {
          this.pushPlateNum = "";
          // 是否开启连续审核
          this.checkAuditStatus();
        } else {
          // 关闭详情页
          // this.quitDetail();
          // 进入暂停页，并且查询待审核事件
          this.queryWaiteAuditEvent();
        }
      });
    },
    enterPatrolAudit(cameraCode, areaIndex) {
      let data = { cameraCode, areaIndex };
      api.enterPatrolAudit(data).then((data) => {
        this.setData(data);
        this.setTimeLine();
        this.setLiveItem(cameraCode);
      });
    },
    setData(data) {
      this.remainParkspace = data.remainParkspace;
      this.bindingRoadAndSpace = data.bindingRoadAndSpace;
      this.dataPool = data.parkspaceResp;
      this.dataPool.forEach((item) => {
        item.clickAble = true;
      });
      if (this.dataPool.length) {
        for (let key in this.dataPool[0]) {
          Vue.set(this.infoData, key, this.dataPool[0][key]);
        }
      }
      this.seleteCar = this.infoData.carNo;
      this.pushPlateNum = this.infoData.carNo;
      // this.setLiveItem(this.cameraCode);
      const imgs = this.infoData.imgs;
      if (Array.isArray(imgs) && imgs.length > 0) {
        let data = this.infoData.imgs.filter((item) => {
          return item.imageType == 1;
        });
        if (data.length) {
          this.imgUrl = data[0].imageUrl;
        } else {
          this.imgUrl = this.infoData.imgs[0].imageUrl;
        }
      }
    },
    setLiveItem(code) {
      window.localStorage.setItem("livingCode", code);
    },
    quitDetail() {
      let data = { cameraCode: this.cameraCode };
      api.completePatrol(data).then(() => {
        this.$router.push({
          path: "/CameraStatusList",
        });
        this.$store.dispatch("tagsView/delVisitedView", {
          path: "/OnSiteInspection",
        });
      });
    },
    changeRemark(value) {
      this.remark = value;
      this.handleAgent(3);
    },
    toOnSiteIns() {
      this.$router.push({
        path: "/OnSiteInspection",
      });
    },
    // 查询待审核事件数量
    queryWaiteAuditEvent() {
      let data = {
        current: 1,
        size: 10,
        parkId: this.$store.getters.userParkId,
      };
      api.findAllNotCheckAgent(data).then((res) => {
        this.waiteCount = res.total;
      });
    },
    slideChange(val) {
      this.startMinu = null;
      let base = this.nowTime - 1000 * 60 * 60 * 24;
      let cos = val * 60 * 1000 * 60;
      let end = base + cos;
      let start = end - 1000 * 60 * 60;
      this.$nextTick(() => {
        this.setMinuLine(start, end);
      });

      this.getSecondImg({
        time: end,
        cameraCode: this.cameraCode,
      });
    },
    slideChangeMinu(val) {
      let cos = val * 5 * 1000 * 60;
      let select = this.startMinu + cos;
      let data = {
        time: select,
        cameraCode: this.cameraCode,
      };
      this.getSecondImg(data);
    },
    setTimeLine() {
      this.nowTime = new Date().getTime();
      this.startSec = this.$moment(this.nowTime).subtract(1, "day").valueOf();
      this.endSec = this.$moment(this.nowTime).valueOf();
      this.timePointer = this.endSec;
      let base = 24;
      for (let i = 0; i <= 24; i++) {
        let time = this.nowTime - base * 1000 * 60 * 60; // 换算小时
        this.marks[i] =
          this.$moment(time).format("HH") +
          ":" +
          this.$moment(time).format("mm");
        base--;
      }
      // this.marks[0] = this.$moment(this.nowTime).subtract(1, 'day').format('HH') + ":" + this.$moment(this.nowTime).subtract(1, 'day').format('mm')
    },
    setMinuLine(start, end) {
      this.startMinu = start;
      this.endMinu = end;
      this.marksMinu = {};
      this.minutePointer = end;
      let base = 0;
      for (let i = 0; i <= 12; i++) {
        let time = start + base * 1000 * 60 * 5; // 换算小时
        this.marksMinu[i] =
          this.$moment(time).format("HH") +
          ":" +
          this.$moment(time).format("mm");
        base++;
      }
      // this.marksMinu[0] = this.$moment(this.startMinu).format('HH') + ":" + this.$moment(this.startMinu).format('mm')
      // this.marksMinu[12] = this.$moment(this.endMinu).format('HH') + ":" + this.$moment(this.endMinu).format('mm')
      // if (this.dataPool.length) {
      //   this.dataPool.forEach(item => {
      //     let time = new Date(item.inTime).getTime()
      //     this.caclIntimePoit(time)
      //   })
      // }
    },
    formatTooltip(val) {
      let base = this.nowTime - 1000 * 60 * 60 * 24;
      let cos = val * 60 * 1000 * 60;
      let select = base + cos;
      let hour =
        new Date(select).getHours() < 10
          ? "0" + new Date(select).getHours()
          : new Date(select).getHours();
      let minute =
        new Date(select).getMinutes() < 10
          ? "0" + new Date(select).getMinutes()
          : new Date(select).getMinutes();
      return hour + ":" + minute;
    },
    formatTooltipMinu(val) {
      let cos = val * 5 * 1000 * 60;
      let select = this.startMinu + cos;
      let hour =
        new Date(select).getHours() < 10
          ? "0" + new Date(select).getHours()
          : new Date(select).getHours();
      let minute =
        new Date(select).getMinutes() < 10
          ? "0" + new Date(select).getMinutes()
          : new Date(select).getMinutes();
      return hour + ":" + minute;
    },
    selectCarNo(carNo, index) {
      if (!carNo.clickAble) return false;
      for (let key in carNo) {
        Vue.set(this.infoData, key, carNo[key]);
      }
      this.selectIndex = index;
      this.seleteCar = this.infoData.carNo;
      this.pushPlateNum = this.infoData.carNo;
      // this.setLiveItem(this.cameraCode);
      if (this.infoData.imgs) {
        let data = this.infoData.imgs.filter((item) => {
          return item.imageType == 1;
        });
        if (data.length) {
          this.imgUrl = data[0].imageUrl;
        } else {
          this.imgUrl = this.infoData.imgs[0].imageUrl;
        }
      }
    },
    /**
     * 迭代: 1053720
     */
    comfirmPlace() {
      Vue.set(this.dataPool[this.selectIndex], "clickAble", false);
      this.seleteCar = "";
      this.pushPlateNum = "";
      this.$message.success("确认在场成功");
    },
    outCar() {
      if (!this.pushPlateNum) {
        this.$message.error("请选择出车车辆");
        return false;
      }
      if (!this.businessTime) {
        this.$message.error("请选择出车时间");
        return false;
      }
      if (this.businessTime > Date.now()) {
        this.$message.error("出车时间不能选未来的时间");
        return false;
      }
      let data = {
        areaIndex: this.areaIndex,
        businessTime: new Date(this.businessTime).getTime(),
        cameraCode: this.cameraCode,
        cameraEventType: 2,
        id: this.infoData.id,
        pushPlateNum: this.pushPlateNum,
      };
      api.outCar(data).then((res) => {
        if (res) {
          this.$message.success("操作成功");
          this.pushPlateNum = "";
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    enterCar() {
      if (!this.pushPlateNumIn) {
        this.$message.error("请输入车牌");
        return false;
      }
      if (!this.businessTimeIn) {
        this.$message.error("请选择入车时间");
        return false;
      }
      if (this.businessTimeIn > Date.now()) {
        this.$message.error("入车时间不能选未来的时间");
        return false;
      }
      let data = {
        areaIndex: this.areaIndex,
        businessTime: new Date(this.businessTimeIn).getTime(),
        cameraCode: this.cameraCode,
        cameraEventType: 1,
        id: this.infoData.id,
        pushPlateNum: this.pushPlateNumIn,
      };
      api.enterCar(data).then((res) => {
        if (res) {
          this.$message.success("操作成功");
        } else {
          this.$message.error("操作失败");
        }
        this.pushPlateNumIn = "";
      });
    },
    getSecondImg(data) {
      api.getSecondImg(data).then((res) => {
        if (res) {
          // res[0] && (this.imgUrlSec1 = res[0])
          // res[1] && (this.imgUrlSec2 = res[1])
          this.imgUrlSec1 = res[0] || "";
          this.imgUrlSec2 = res[1] || "";
        }
      });
    },
    caclIntimePoit(time) {
      if (time > this.startMinu && time < this.endMinu) {
        let num = Math.ceil(time - this.startMinu) / 5 / 1000 / 60;
        this.marksMinu[num] =
          this.$moment(time).format("HH") +
          ":" +
          this.$moment(time).format("mm");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.site-detail {
  display: flex;
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
  }
  &-content {
    float: left;
    width: calc(100% - 390px);
    padding: 0 24px 24px 24px;
    background-color: #f4f6fc;
    &-top {
      margin-bottom: 24px;
      &-button {
        display: flex;
        margin-bottom: 24px;
        span {
          width: 106px;
          line-height: 40px;
          font-size: 14px;
          color: #595959;
          text-align: center;
          border-radius: 2px 0px 0px 2px;
          cursor: pointer;
          background-color: #fff;
        }
        .active {
          background-color: #1890ff;
          color: #fff;
        }
      }
    }
    &-bottom {
      display: flex;
      overflow-x: scroll;
      margin-top: 24px;
      &-item {
        width: 155px;
        margin-right: 26px;
        border: 1px solid transparent;
        background-color: #000;
        padding-top: 34px;
        display: flex;
        flex-direction: column;
        img {
          height: 87px;
          width: 100%;
          background-color: #fff;
        }
        span {
          line-height: 34px;
          text-align: center;
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
        }
      }
      .active {
        border: 1px solid rgba(24, 144, 255, 1);
      }
    }
  }
  &-side {
    width: 340px;
    height: 100%;
    background-color: #fff;
    float: left;
    &-header {
      padding-left: 24px;
      padding-right: 24px;
      &-top {
        // display: flex;
        overflow: hidden;
        padding-top: 10px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f4f6fc;
        .button {
          float: left;
          padding: 0 10px;
          border-radius: 2px;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
        }
        .out {
          background-color: #1890ff;
          color: #fff;
        }
        .check {
          background-color: #ffbf18;
          color: #fff;
        }
        .in {
          background-color: #ff7818;
          color: #fff;
        }
        .count-time {
          border-radius: 2px;
          background-color: #ffe6e6;
          color: #ed2121;
          font-size: 14px;
          line-height: 24px;
          display: flex;
        }
        .exsit {
          width: 24px;
          height: 24px;
          background: url("../../assets/image/site_exsit.png");
          background-size: 100% 100%;
          cursor: pointer;
          float: right;
        }
        .count-down {
          p {
            span &:nth-of-type(1) {
              display: none;
            }
            i &:nth-last-of-type(1) {
              display: none;
            }
          }
        }
      }
      &-center {
        padding: 24px 0;
        font-size: 14px;
        line-height: 20px;
        color: #595959;
        border-bottom: 1px solid #e4e4e4;
        &-item {
          margin-bottom: 8px;
          .red {
            color: #ed2121;
          }
          .green {
            color: green;
          }
        }
      }
      &-bottom {
        padding-top: 24px;

        &-tab {
          line-height: 32px;
          display: flex;
          cursor: pointer;
          span {
            text-align: center;
            flex: 1;
            background: #ededed;
            border-radius: 0px 2px 2px 0px;
            color: rgba(89, 89, 89, 1);
            margin-bottom: 18px;
          }
          .active {
            background: #1890ff;
            color: #fff;
            border-radius: 2px 0px 0px 2px;
          }
        }

        &-left {
          background-color: #f4f6fc;
          margin-bottom: 24px;
          padding: 10px;
          &-plate {
            float: left;
            div {
              width: 120px;
              line-height: 40px;
              background: #ededed;
              border: 1px solid #ededed;
              text-align: center;
              border-radius: 2px;
              font-weight: bold;
              cursor: pointer;
              margin-bottom: 15px;
            }
            .select {
              background: #1890ff;
              border: 1px solid #1890ff;
              color: #fff;
            }
            .disable {
              cursor: not-allowed;
            }
            &:nth-of-type(odd) {
              margin-right: 25px;
            }
          }
          &-button {
            display: flex;
            justify-content: flex-end;
            padding: 8px 0 10px 0;
            div {
              line-height: 30px;
              border-radius: 2px;
              padding: 0 9px;
              font-size: 14px;
              cursor: pointer;
            }
            .blue {
              color: rgba(24, 144, 255, 1);
              border: 1px solid rgba(24, 144, 255, 1);
              margin-right: 6px;
            }
          }
        }
        &-input {
          margin-bottom: 16px;
          span {
            font-size: 14px;
            margin-right: 8px;
            color: rgba(89, 89, 89, 1);
          }
          input {
            width: 191px;
            height: 32px;
            background: #ffffff;
            border-radius: 2px;
            text-indent: 4px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            &:focus {
              outline: none;
              border: 1px solid #1890ff;
              border-radius: 2px;
            }
          }
        }
      }
      &-complte {
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  &-waite {
    font-size: 18px;
    font-weight: bold;
  }
  .border-line {
    border-top: 1px solid #e4e4e4;
    margin: 24px 0;
  }
  .img-container {
    width: 100%;
    min-height: 555px;
    overflow: hidden;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mr-5 {
    margin-right: 5px;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .df {
    display: flex;
  }
  .clear {
    overflow: hidden;
  }
  .w-100 {
    width: 100%;
  }
  .w-95 {
    width: 95%;
  }
  .no-data {
    width: 100%;
    line-height: 500px;
    text-align: center;
    color: rgba(89, 89, 89, 1);
  }
  .button-blue {
    background: #1890ff;
    border-radius: 2px;
    color: #fff;
    text-align: center;
  }
  .el-date-editor.el-input {
    width: 193px;
  }
  .sec-img-container {
    &-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .img-box {
        width: 49%;
      }
    }
  }
  .time-tips {
    padding-left: 30px;
    width: 85%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
