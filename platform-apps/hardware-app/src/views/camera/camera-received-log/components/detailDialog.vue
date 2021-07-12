<template>
  <el-dialog class="detail-dialog"
             title="日志详情"
             :visible.sync="dialogVisible"
             width="1120px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <div class="detail-dialog-content">
      <div class="detail-dialog-content-left">
        <div>
          <div class="detail-dialog-title">日志基本信息</div>
          <div class="detail-dialog-part"
               v-for="(item, key) in information"
               :key="key"
               :style="{ width: item.width }">
            <span class="detail-dialog-part-key">{{ item.title }}：</span>
            <span class="detail-dialog-part-value">{{
              item.dic ? mappingDic(item.dic, item.value) : item.value
            }}</span>
          </div>
        </div>
        <div>
          <div class="detail-dialog-title">日志处理信息</div>
          <div class="detail-dialog-part"
               v-for="(item, key) in processInformation"
               :key="key"
               :style="{ width: item.width }">
            <span class="detail-dialog-part-key"
                  v-if="item.show">{{ item.title }}：</span>
            <span class="detail-dialog-part-value"
                  v-if="item.show">{{
              item.dic
                ? mappingDic(item.dic, item.value)
                  ? mappingDic(item.dic, item.value)
                  : '-'
                : item.value
                ? item.value
                : '-'
            }}</span>
          </div>
          <div class="detail-dialog-part">
            <span class="detail-dialog-part-key">总耗时：</span>
            <span class="detail-dialog-part-value">{{timeStampEn(processInformation[processInformation.length-1].value)}}</span>
          </div>
        </div>
      </div>
      <div class="detail-dialog-content-right">
        <div class="detail-dialog-title">日志流程</div>
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in processLog"
                            :key="index"
                            placement="top"
                            :timestamp="activity.createTime">
            <div v-if="activity.processResult != 1">{{mappingDic('EventHandleProcess', activity.process)}}</div>
            <div>{{mappingDic('HandleProcessResult', activity.processResult)}}</div>
            <div v-if="activity.process !=4">
              <span v-if="activity.processResult == 1 && activity.process !=4">推送原因：</span>
              <span>{{activity.reason}}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      information: [
        { key: 'cameraCode', value: '', title: '相机编号', width: '50%' },
        {
          key: 'cameraPattern',
          value: '',
          title: '相机模式',
          width: '50%',
          dic: 'CameraPattern'
        },
        { key: 'receivingTime', value: '', title: '业务时间', width: '50%' },
        {
          key: 'cameraEventType',
          value: '',
          title: '事件类型',
          width: '50%',
          dic: 'CameraEventType'
        },
        {
          key: 'cameraPlateNum',
          value: '',
          title: '相机识别车牌',
          width: '50%'
        },
        {
          key: 'plateType',
          value: '',
          title: '车牌类型',
          width: '50%',
          dic: 'PlateType'
        },
        {
          key: 'plateReliability',
          value: '',
          title: '车牌可信度',
          width: '50%'
        },
        {
          key: 'eventReliability',
          value: '',
          title: '车位可信度',
          width: '50%'
        },
        { key: 'eventId', value: '', title: '事件ID', width: '100%' },
        {
          key: 'opppsideEventId',
          value: '',
          title: '对应事件ID',
          width: '100%'
        },
        {
          key: 'bindingRoadAndSpace',
          value: '',
          title: '绑定路段及车位',
          width: '100%'
        },
        { key: 'areaIndex', value: '', title: '车位区域索引', width: '50%' },
        { key: 'parkingUse', value: '', title: '车辆占用车位号', width: '50%' },
        {
          key: 'parkingVtUse',
          value: '',
          title: '虚拟占用车位号',
          width: '50%'
        },
        {
          key: 'carType',
          value: '',
          title: '车辆类型',
          width: '50%',
          dic: 'CarType'
        },
        {
          key: 'carState',
          value: '',
          title: '停车状态',
          width: '50%',
          dic: 'CarState'
        },
        {
          key: 'validity',
          value: '',
          title: '事件有效性',
          width: '50%',
          dic: 'Validity'
        }
      ],
      processInformation: [
        // { key: 'platformHandle', value: '12', title: '平台判断结果', width: '50%', dic: 'HandleProcessResult', show: true },
        { key: 'agentHandle', value: '', title: '坐席判断结果', width: '50%', dic: 'HandleProcessResult', show: true },
        { key: 'finalHandle', value: '', title: '最终结果', width: '50%', dic: 'HandleProcessResult', show: true },
        { key: 'pushPlateNum', value: '', title: '推送车牌', width: '50%', show: true },
        { key: 'pushRoadName', value: '', title: '推送路段', width: '50%', show: true },
        { key: 'pushParkspaceNo', value: '', title: '推送车位', width: '50%', show: true },
        { key: 'finalResult', value: '', title: '第三方返回结果', width: '50%', dic: 'HandleProcessResult', show: true },
        { key: 'processTime', value: '', title: '总耗时', width: '50%', show: false },
      ],
      processLog: []
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Object,
      default() {
        // return null;
        return {};
      }
    }
  },
  watch: {
    // dialogVisible(val) {
    //   val &&
    //     this.$nextTick(() => {
    //       this.param = {
    //         parkName: '',
    //         parkCode: '',
    //         current: 1,
    //         size: 10,
    //       };
    //       this.getNotAddParkings();
    //     });
    // },
    dataItem: {
      deep: true,
      handler(newVal) {
        this.information = this.dealData(newVal.information, this.information);
        this.processInformation = this.dealData(
          newVal.processInformation,
          this.processInformation
        );
        this.processLog = newVal.processLog;
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
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
      if (!time) return '-'
      if (parseInt(second_time) > 60) {
        var min = parseInt(second_time / 60);
        time = min + '分';
        if (min > 60) {
          min = parseInt(second_time / 60) % 60;
          var hour = parseInt(parseInt(second_time / 60) / 60);
          time = hour + '小时' + min + '分';
          if (hour > 24) {
            hour = parseInt(parseInt(second_time / 60) / 60) % 24;
            var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
            time = day + '天' + hour + '小时' + min + '分';
          }
        }
      } else {
        time = time + '秒'
      }
      return time;
    }
  }
};
</script>
<style scoped lang="less">
.detail-dialog {
  &-content {
    display: flex;
    &-left {
      width: 70%;
      padding-left: 20px;
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
    float: left;
    &-key {
      margin-bottom: 20px;
    }
  }
}
</style>
