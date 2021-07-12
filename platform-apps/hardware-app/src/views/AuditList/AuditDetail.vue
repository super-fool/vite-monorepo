<template>
  <div class="audit-detail">
    <div class="df w-100" v-if="cameraCode.length">
      <div class="audit-detail-content">
        <div class="audit-detail-content-top">
          <div class="audit-detail-content-top-button">
            <span :class="{ active: !activeTab }" @click="changeTab(0)"
              >图片</span
            >
            <span :class="{ active: activeTab }" @click="changeTab(1)"
              >视频</span
            >
          </div>
          <div class="img-container" v-show="!activeTab">
            <imgBox :imgUrl="imgUrl"></imgBox>
          </div>
        </div>
        <div class="audit-detail-content-bottom">
          <div
            class="audit-detail-content-bottom-item"
            :class="{ active: item.src == imgUrl }"
            @mouseenter="changeImg(item)"
            v-for="(item, key) in infoData.imgs"
            :key="key"
          >
            <i
              class="audit-detail-content-bottom-item-tag"
              v-if="item.imageType == 1 || item.imageType == 0"
              >事件图</i
            >
            <img :src="item.imageUrl" alt="" />
            <span>{{ item.imageTime }}</span>
          </div>
        </div>
      </div>
      <div class="audit-detail-side">
        <div class="audit-detail-side-header">
          <div class="audit-detail-side-header-top">
            <div
              class="button mr-10"
              :class="{
                out: infoData.cameraEventType == 2,
                in: infoData.cameraEventType == 1,
              }"
            >
              {{ mappingDic("CameraEventType", infoData.cameraEventType) }}
            </div>
            <div class="button count-time">
              <span class="mr-5">倒计时</span>
              <count-down
                class="count-down"
                @end_callback="countDownEnd()"
                :secondsTxt="''"
                :startTime="startTime"
                :currentTime="startTime"
                :endTime="endTime"
              ></count-down>
            </div>
            <div class="setting" @click="settingHandle">
              <div class="setting-modal" v-show="showSetting">
                <el-switch v-model="continuousAudit" inactive-text="连续审核">
                </el-switch>
                <div class="setting-modal-button" @click.stop="chooseArea">
                  审核区域选择
                </div>
              </div>
            </div>
            <div class="exsit" @click="handleQuit"></div>
          </div>
          <div class="audit-detail-side-header-center">
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >相机编号：</span
              >
              <span class="audit-detail-side-header-center-item-title">{{
                infoData.cameraCode
              }}</span>
            </div>
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >区域位置：</span
              >
              <span class="audit-detail-side-header-center-item-title">{{
                infoData.pushRoadName
              }}</span>
            </div>
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >区域状态：</span
              >
              <span
                class="audit-detail-side-header-center-item-title"
                :class="{ red: infoData.areaFull, green: !infoData.areaFull }"
                >{{ infoData.areaFull ? "已满" : "未满" }}</span
              >
            </div>
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >审核理由：</span
              >
              <span class="audit-detail-side-header-center-item-title">{{
                infoData.pushReason
              }}</span>
            </div>
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >业务时间：</span
              >
              <span class="audit-detail-side-header-center-item-title">{{
                infoData.businessTime
              }}</span>
            </div>
            <div class="audit-detail-side-header-center-item">
              <span class="audit-detail-side-header-center-item-title"
                >事件ID：</span
              >
              <span class="audit-detail-side-header-center-item-title">{{
                infoData.eventId
              }}</span>
            </div>
          </div>
          <div class="audit-detail-side-header-bottom">
            <div class="audit-detail-side-header-bottom-plate">
              {{ infoData.cameraPlateNum }}
            </div>
            <div
              class="audit-detail-side-header-bottom-input"
              v-if="infoData.cameraEventType != 1"
            >
              <span>车位选择：</span>
              <el-select
                v-model="parkspaceObj"
                clearable
                value-key="id"
                @change="parkspaceNoChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in infoData.parkSpaces"
                  :key="item.id"
                  :label="item.roadName + item.roadCode + item.carNo"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div
              class="audit-detail-side-header-bottom-input"
              v-if="parkspaceObj.inTime"
            >
              <span class="mr-5">{{ parkspaceObj.carNo }}</span>
              <span class="mr-5">于</span>
              <span class="mr-5">{{ parkspaceObj.inTime }}</span>
              <span>入车</span>
            </div>
            <!-- feat: 1052314 -->
            <!-- v-if="infoData.cameraEventType !== 2" -->
            <div
              class="audit-detail-side-header-bottom-input"
            >
              <span>修改车牌：</span>
              <PlateNumberQuery :plate-number.sync="pushPlateNum" />
            </div>
            <div class="audit-detail-side-header-bottom-button">
              <span
                class="blue"
                :class="{
                  disabled: infoData.areaFull && infoData.cameraEventType == 1,
                  loading: loading,
                }"
                @click="handleAgent(1)"
                >确认</span
              >
              <span
                class="red"
                :class="{ loading: loading }"
                @click="confuseAuditHandle(2)"
                >作废</span
              >
              <span
                class="grey"
                :class="{ loading: loading }"
                @click="confuseAuditHandle(3)"
                >无法判断</span
              >
              <span
                class="blue"
                :class="{ loading: loading }"
                @click="toOnSiteIns"
                >巡检</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="!cameraCode.length && continuousAudit"
         class="audit-detail-waite">暂无数据</div> -->
    <div v-if="!cameraCode.length" class="audit-detail-waite">
      <div class="audit-detail-waite-text">
        待审核事件数量：{{ waiteCount }}
      </div>
      <el-button @click="continueCheck" :disabled="!waiteCount" type="primary"
        >点击进入审核</el-button
      >
    </div>
    <AuditDialog
      :dialogVisible.sync="auditModalVisible"
      :continuousAudit="continuousAudit"
      :isDetail="true"
      :area="cameraCodeInArea"
      @offSetting="offSetting"
    ></AuditDialog>
    <ConfuseAudit
      :dialogVisible.sync="confuseModalVisible"
      :modalType="modalType"
      :remark="modalTypeRemark"
      @changeRemark="changeRemark"
    ></ConfuseAudit>
  </div>
</template>

<script>
import Vue from "vue";
import imgBox from "./components/imgBox.vue";
import AuditDialog from "./components/auditDialog";
import ConfuseAudit from "./components/confuseAudit";
import CountDown from "vue2-countdown";
import * as api from "@/api/audit";

import PlateNumberQuery from "@/components/PlateNumberQuery";
export default {
  data() {
    return {
      // 查询车牌
      pushPlateNum: "",
      activeTab: 0,
      continuousAudit: true,
      imgUrl: "",
      showSetting: false,
      auditModalVisible: false,
      confuseModalVisible: false,
      cameraCode: "",
      auditStatus: null,
      timer: null,
      waiteTimer: null,
      remark: "",
      startTime: new Date().getTime(),
      endTime: new Date().getTime() + 1000 * 60 * 10,
      // startTime: 0,
      // endTime: 0,
      infoData: {},
      showInterVal: false,
      waiteCount: 0,
      options: [],
      parkspaceObj: "",
      cameraCodeInArea: [],
      loading: false,
      modalType: 2,
      modalTypeRemark: "1",
    };
  },
  async created() {
    await this.findAuditSetting();
    if (this.$store.getters.auditClick) {
      // 用户从列表点击进入的
      if (this.$route.query.id) {
        // 单条审核跳转过来的
        this.auditOne(this.$route.query.id, this.$route.query.parkId);
      } else {
        this.queryWaiteAuditEvent(this.continuousAudit, true);
      }
    } else {
      // 页面刷新 需查询当前审核状态
      let res = await this.checkAuditStatus();
      if (res.id) {
        this.hasChekingEvent(res.id);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.$store.dispatch("tagsView/delVisitedView", {
      path: "/AuditDetail",
    });
  },
  components: {
    imgBox,
    AuditDialog,
    ConfuseAudit,
    CountDown,
    PlateNumberQuery,
  },
  methods: {
    auditSequenceNextOne(id) {
      clearInterval(this.timer);
      let data = {
        parkId: id ? id : this.$store.getters.userParkId,
      };
      api.auditSequenceNextOne(data).then((data) => {
        this.setData(data);
      });
    },
    queryNewAuditEvent() {
      // let data = {cameraCode:this.cameraCode}
      api.queryNewAuditEvent({}).then((data) => {
        if (data && data.parkId && !this.showInterVal) {
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
              this.auditOne(data.id, data.parkId);
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
      if (v == 1) return false;
      this.activeTab = v;
    },
    changeImg(item) {
      this.imgUrl = item.imageUrl;
    },
    chooseArea() {
      this.auditModalVisible = true;
    },
    confuseAuditHandle(val) {
      if (val == 3) {
        this.modalTypeRemark = "7";
      } else {
        this.modalTypeRemark = "1";
      }
      this.confuseModalVisible = true;
      this.modalType = val;
    },
    countDownEnd() {
      let data = { id: this.infoData.id };
      api.handleTimeOut(data).then(() => {
        this.$confirm(
          "您未在时限内完成操作，为避免造成待审核事件推荐，系统已自动将该条信息做无法判断处理，请你选择继续处理下一条或退出审核页?",
          "超时提醒",
          {
            confirmButtonText: "继续下一条",
            cancelButtonText: "退出审核页",
            type: "warning",
          }
        )
          .then(() => {
            this.cameraCode = "";
            // 查看是否有待审核事件
            this.queryWaiteAuditEvent(this.continuousAudit, true);
          })
          .catch(() => {
            // 退出审核详情页
            this.quitDetail();
          });
      });
    },
    handleQuit() {
      if (this.cameraCode) {
        let data = { id: this.infoData.id };
        api.handleQuit(data).then(() => {
          //  关闭详情页
          this.quitDetail();
        });
      } else {
        //  关闭详情页
        this.quitDetail();
      }
    },
    handleAgent(status) {
      if (this.loading) return false;
      if (
        status == 1 &&
        this.infoData.areaFull &&
        this.infoData.cameraEventType == 1
      ) {
        return false;
      }
      if (
        status == 1 &&
        this.infoData.cameraEventType == 2 &&
        !this.parkspaceObj.carNo
      ) {
        this.$message.error("请选择出车车位");
        return false;
      }
      this.loading = true;
      let data = {
        auditResult: status,
        pushPlateNum: this.pushPlateNum
          ? this.pushPlateNum
          : this.infoData.pushPlateNum,
        remark: this.remark,
        id: this.infoData.id,
        parkspaceNo: this.parkspaceObj.parkspaceNo,
        hasCatPlateNum: this.parkspaceObj.carNo,
        roadCode: this.parkspaceObj.roadCode,
      };
      api
        .handleAgent(data)
        .then(() => {
          this.cameraCode = "";
          this.parkspaceObj = "";
          this.waiteCount && this.waiteCount--;
          this.pushPlateNum = "";
          // 开启连续审核的标志 决定是否查下一条数据的详情
          this.queryWaiteAuditEvent(this.continuousAudit, true);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    auditOne(id, parkId) {
      let data = { id, parkId };
      api
        .auditOne(data)
        .then((data) => {
          this.setData(data);
        })
        .then(() => {
          // console.log(data);
        });
    },
    setData(data) {
      if (data && Object.keys(data).length) {
        clearInterval(this.timer);
        for (let key in data) {
          Vue.set(this.infoData, key, data[key]);
        }
        this.cameraCode = data.cameraCode;
        let ten = 1000 * 60 * 10;
        let auditime = this.$moment(data.auditTime).valueOf();
        let serverTime = this.$moment(data.serverTime).valueOf();
        if (auditime) {
          // 已经审核过 有时间
          if (serverTime - auditime > ten) {
            // 超时
            this.$confirm(
              "您未在时限内完成操作，为避免造成待审核事件推荐，系统已自动将该条信息做无法判断处理，请你选择继续处理下一条或退出审核页?",
              "超时提醒",
              {
                confirmButtonText: "继续下一条",
                cancelButtonText: "退出审核页",
                type: "warning",
              }
            )
              .then(() => {
                // 查看是否有待审核事件
                this.queryWaiteAuditEvent(this.continuousAudit, true);
              })
              .catch(() => {
                // 退出审核详情页
                this.quitDetail();
              });
          } else {
            this.startTime = auditime;
            this.endTime = auditime + (ten - (serverTime - auditime));
          }
        } else {
          this.startTime = serverTime;
          this.endTime = serverTime + ten;
        }
        this.setLiveItem(this.cameraCode);
        if (this.infoData.imgs.length) {
          let data = this.infoData.imgs.filter((item) => {
            return item.imageType == 1;
          });
          if (data.length) {
            this.imgUrl = data[0].imageUrl;
          } else {
            this.imgUrl = this.infoData.imgs[0].imageUrl;
          }
        }
      } else {
        this.cameraCode = "";
      }
    },
    setLiveItem(code) {
      localStorage.setItem("livingCode", code);
    },
    quitDetail() {
      this.$router.push({
        path: "/AuditList",
      });
      this.$store.dispatch("tagsView/delVisitedView", {
        path: "/AuditDetail",
      });
    },
    changeRemark(obj) {
      this.remark = obj.reason;
      this.handleAgent(obj.modalType);
    },
    toOnSiteIns() {
      this.$router.push({
        path: "/OnSiteInspection",
        query: {
          cameraCode: this.infoData.cameraCode,
          areaIndex: this.infoData.areaIndex,
        },
      });
    },
    // 查询待审核事件数量
    queryWaiteAuditEvent(inDetail = false, interVal = false) {
      api.findAreaCanAuditAgentCount().then((res) => {
        this.waiteCount = res;
        inDetail &&
          this.waiteCount &&
          this.auditSequenceNextOne(this.$route.parkId);
        // this.waiteCount && this.auditSequenceNextOne()
      });
      if (interVal) {
        this.timer = setInterval(() => {
          this.queryWaiteAuditEvent();
        }, 6000);
      }
    },
    async continueCheck() {
      clearInterval(this.timer);
      this.cameraCodeInArea.forEach((item) => {
        item.isEnable = 1;
      });
      await this.saveAuditSettings();
      this.auditSequenceNextOne(this.$route.parkId);
    },
    parkspaceNoChange(val) {
      console.log(val);
      this.pushPlateNum = val.carNo;
    },
    findAuditSetting() {
      api
        .findAuditSetting({ parkId: this.$store.getters.userParkId })
        .then((data) => {
          if (data.length) {
            this.cameraCodeInArea = data;
            this.continuousAudit = data.some((item) => {
              return item.isEnable == 1;
            });
          } else {
            this.continuousAudit = true;
          }
        });
    },
    offSetting(data) {
      this.cameraCodeInArea = data;
      this.showSetting = false;
    },
    saveAuditSettings() {
      if (!this.cameraCodeInArea.length) {
        this.$message.error("请选择审核的区域");
        return false;
      }
      // 开启连续审核
      return api.saveAuditSettings(this.cameraCodeInArea).then(() => {
        this.continuousAudit = true;
      });
    },
    // 查询用户审核状态
    checkAuditStatus() {
      let data = { parkId: this.$store.getters.userParkId };
      // let data = { parkId: '1346766821899620353' }
      return api.checkAuditStatus(data).then((data) => {
        return { id: data && data.id };
      });
    },
    hasChekingEvent(id) {
      this.$confirm("是否继续该事件的审核?", "有审核中事件", {
        confirmButtonText: "继续",
        cancelButtonText: "忽略",
        type: "warning",
      })
        .then(() => {
          // 进入审核详情页
          this.auditOne(id, this.$store.getters.userParkId);
        })
        .catch(() => {
          let data = { id };
          api.handleIgnore(data).then(() => {
            this.auditSequenceNextOne(id);
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.audit-detail {
  display: flex;
  height: 100%;
  &-header {
    display: flex;
    justify-content: space-between;
  }
  &-content {
    width: calc(100% - 390px);
    flex-grow: 1;
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
      &-item {
        flex-shrink: 0;
        width: 155px;
        margin-right: 26px;
        border: 1px solid transparent;
        background-color: #000;
        padding-top: 34px;
        display: flex;
        flex-direction: column;
        position: relative;

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
        &-tag {
          position: absolute;
          left: 0;
          top: 0;
          padding: 5px;
          font-size: 12px;
          line-height: 14px;
          background-color: #777719;
          color: #fff;
          font-style: initial;
        }
      }
      .active {
        border: 1px solid rgba(24, 144, 255, 1);
      }
    }
  }
  &-side {
    width: 360px;
    background-color: #fff;
    flex-shrink: 0;
    &-header {
      padding: 0 20px;
      // padding-right: 24px;
      &-top {
        display: flex;
        padding-top: 10px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f4f6fc;
        .button {
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
        .setting {
          width: 24px;
          height: 24px;
          background: url("../../assets/image/site_setting.png");
          background-size: 100% 100%;
          margin: 0 24px 0 10px;

          position: relative;
          cursor: pointer;
          &-modal {
            position: absolute;
            width: 135px;
            height: 67px;
            padding: 10px 16px;
            background: #ffffff;
            box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
              0px 6px 16px 0px rgba(0, 0, 0, 0.08),
              0px 3px 6px -4px rgba(0, 0, 0, 0.12);
            border-radius: 2px;
            font-size: 14px;
            left: -94px;
            top: 34px;
            color: rgba(0, 0, 0, 0.65);
            &-button {
              line-height: 32px;
              border-radius: 2px;
              border: 1px solid #1890ff;
              color: #1890ff;
              text-align: center;
              margin-top: 13px;
            }
          }
        }
        .exsit {
          width: 24px;
          height: 24px;
          background: url("../../assets/image/site_exsit.png");
          background-size: 100% 100%;
          cursor: pointer;
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
        padding: 20px 0;
        padding-right: 8px;
        display: flex;
        flex-direction: column;
        &-plate {
          width: 127px;
          line-height: 40px;
          text-align: center;
          background: #e3f2ff;
          border-radius: 2px;
          color: #1890ff;
          font-size: 18px;
          margin-bottom: 24px;
        }
        &-input {
          flex: 1;
          display: flex;
          margin-bottom: 16px;
          span {
            font-size: 14px;
            color: #595959;
            width: 80px;
            height: 32px;
            line-height: 32px;
          }
          input {
            flex: 1;
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
        &-button {
          display: flex;
          span {
            line-height: 32px;
            text-align: center;
            padding: 0 16px;
            font-size: 14px;
            border-radius: 2px;
            margin-right: 7px;
          }
          .blue {
            background: #1890ff;
            color: #fff;
            border: 1px solid #1890ff;
            cursor: pointer;
          }
          .red {
            border: 1px solid #ed2121;
            color: #ed2121;
            cursor: pointer;
          }
          .grey {
            border: 1px solid #d9d9d9;
            color: rgba(89, 89, 89, 1);
            cursor: pointer;
          }
          .disabled,
          .loading {
            background-color: rgba(217, 217, 217, 1);
            color: #fff;
            cursor: not-allowed;
            border: 1px solid rgba(217, 217, 217, 1);
          }
        }
      }
    }
  }
  &-waite {
    background-color: #fff;
    height: 100%;
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &-text {
      margin-bottom: 24px;
    }
  }
  .img-container {
    width: 100%;
    height: 555px;
    overflow: hidden;
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
  .w-100 {
    width: 100%;
  }
  // .no-data {
  //   width: 100%;
  //   line-height: 500px;
  //   text-align: center;
  //   color: rgba(89, 89, 89, 1);
  //   background-color: #fff;
  // }
}
</style>
