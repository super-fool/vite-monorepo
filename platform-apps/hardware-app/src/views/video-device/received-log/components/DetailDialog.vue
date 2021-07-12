<template>
  <el-dialog
    class="detail-dialog"
    title="日志详情"
    :visible.sync="dialogVisible"
    width="1120px"
    v-if="dialogVisible"
    :before-close="handleClose"
  >
    <div class="detail-dialog-content">
      <div class="detail-dialog-content-left">
        <div class="detail-dialog-title">日志基本信息</div>
        <div class="left-container">
          <div
            class="detail-dialog-part"
            v-for="(item, key) in information"
            :key="key"
            :style="{ width: item.width }"
          >
            <span class="detail-dialog-part-key">{{ item.title }}：</span>
            <span class="detail-dialog-part-value">{{
              item.dic ? mappingDic(item.dic, item.value) : item.value
            }}</span>
          </div>
        </div>
        <div class="detail-dialog-title">日志处理信息</div>
        <div class="left-container">
          <div
            class="detail-dialog-part"
            v-for="(item, key) in processInformation"
            :key="key"
            :style="{ width: item.width }"
          >
            <span class="detail-dialog-part-key" v-if="item.show"
              >{{ item.title }}：</span
            >
            <span class="detail-dialog-part-value" v-if="item.show"
              >{{
                item.dic
                  ? mappingDic(item.dic, item.value)
                    ? mappingDic(item.dic, item.value)
                    : "-"
                  : item.value
                  ? item.value
                  : "-"
              }}
              {{ item.suffix || "" }}</span
            >
          </div>
          <!-- <div class="detail-dialog-part">
            <span class="detail-dialog-part-key">总耗时：</span>
            <span class="detail-dialog-part-value">{{
              timeStampEn(
                processInformation[processInformation.length - 1].value
              )
            }}</span>
          </div> -->
        </div>
      </div>
      <div class="detail-dialog-content-right">
        <div class="detail-dialog-title">日志流程</div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in processLog"
            :key="index"
            placement="top"
            :timestamp="activity.createTime"
          >
            <div v-if="activity.processResult != 1">
              {{ mappingDic("EventHandleProcess", activity.process) }}
            </div>
            <div>
              {{ mappingDic("HandleProcessResult", activity.processResult) }}
            </div>
            <div v-if="activity.process != 4">
              <span v-if="activity.processResult == 1 && activity.process != 4"
                >推送原因：</span
              >
              <span>{{ activity.reason }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DetailLog",
  data() {
    return {
      information: [
        { key: "deviceCode", value: "", title: "设备编号", width: "40%" },
        {
          key: "businessTime",
          value: "",
          title: "业务时间",
          width: "40%",
        },
        {
          key: "carState",
          value: "",
          title: "事件类型",
          width: "40%",
          dic: "DeviceCarStatus",
        },
        {
          key: "plate",
          value: "",
          title: "识别车牌",
          width: "40%",
        },
        {
          key: "carType",
          value: "",
          title: "车辆类型",
          width: "40%",
          dic: "CarType",
        },
        {
          key: "plateReliability",
          value: "",
          title: "车牌可信度",
          width: "40%",
        },
        {
          key: "carStateReliability",
          value: "",
          title: "车位状态可信度",
          width: "40%",
        },
        { key: "eventId", value: "", title: "事件ID", width: "100%" },
        {
          key: "roadName",
          value: "",
          title: "绑定路段及车位",
          width: "100%",
        },
      ],
      processInformation: [
        {
          key: "finalHandle",
          value: "",
          title: "最终结果",
          width: "40%",
          dic: "HandleProcessResult",
          show: true,
        },
        {
          key: "pushPlateNum",
          value: "",
          title: "推送车牌",
          width: "40%",
          show: true,
        },
        {
          key: "pushRoadName",
          value: "",
          title: "推送路段",
          width: "40%",
          show: true,
        },
        {
          key: "pushParkspaceNo",
          value: "",
          title: "推送车位",
          width: "40%",
          show: true,
        },
        {
          key: "finalResult",
          value: "",
          title: "第三方返回结果",
          width: "40%",
          dic: "HandleProcessResult",
          show: true,
        },
        {
          key: "finalResult",
          value: "",
          title: "第三方返回结果",
          width: "40%",
          dic: "HandleProcessResult",
          show: true,
        },
        {
          key: "processTime",
          value: "0",
          suffix: "秒",
          title: "总耗时",
          width: "40%",
          show: true,
        },
      ],
      processLog: [],
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    dataItem: {
      deep: true,
      handler(newVal) {
        this.information = this.dealData(newVal.info, this.information);
        this.processInformation = this.dealData(
          newVal.process,
          this.processInformation
        );
        this.processLog = newVal.processLog;
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    dealData(origin = [], target = {}) {
      target.forEach((item) => {
        for (let key in origin) {
          if (item.key == key) {
            item.value = origin[key];
          }
        }
      });
      return target;
    },
    timeStampEn(second_time) {
      var time = parseInt(second_time);
      if (!time) return "-";
      if (parseInt(second_time) > 60) {
        var min = parseInt(second_time / 60);
        time = min + "分";
        if (min > 60) {
          min = parseInt(second_time / 60) % 60;
          var hour = parseInt(parseInt(second_time / 60) / 60);
          time = hour + "小时" + min + "分";
          if (hour > 24) {
            hour = parseInt(parseInt(second_time / 60) / 60) % 24;
            var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
            time = day + "天" + hour + "小时" + min + "分";
          }
        }
      } else {
        time = time + "秒";
      }
      return time;
    },
  },
};
</script>
<style scoped lang="less">
.left-container {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}
.detail-dialog {
  &-content {
    display: flex;
    &-left {
      width: 70%;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
    }
    &-right {
      width: 30%;
    }
  }
  &-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  &-part {
    display: flex;
    &-key {
      margin-bottom: 20px;
    }
  }
}
</style>
