<template>
  <ListPresenter
    v-bind="fields"
    query-url="/manage/manage/camera-log/list"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
    <template #dialogs>
      <ImageDetailDialog
        :dialogVisible.sync="markImgDialog.check"
        :data-item="markImgDialog.data"
      ></ImageDetailDialog>
      <detailDialog
        :dialogVisible.sync="detailLog.check"
        :data-item="detailLog.data"
      ></detailDialog>
      <LogsDialog
        :data-str="recivedLog.logStr"
        :dialogVisible.sync="recivedLog.check"
      ></LogsDialog>
      <ImageDetailDialog
        :dialogVisible.sync="imgDialog.check"
        :data-item="imgDialog.imgItem"
      ></ImageDetailDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
      <el-button
        type="text"
        :disabled="scope.row.cameraType == 1"
        @click="onMarkImgDetail(scope.row)"
        >标记图</el-button
      >
      <el-button type="text" @click="onCheckLog(scope.row)">日志</el-button>
    </template>

    <!-- 自定义列 Cell: v-slot后的字段使用自定义字段的表头名-->
    <template #originalInfo="{ row }">
      <el-button type="text" @click="onCheckDetailLog(row)">查看</el-button>
    </template>
    <template #roadName="{ row }">
      {{
        `${row.roadName || ""}${
          row.parkspaceNo ? "(" + row.parkspaceNo + ")" : ""
        }`
      }}
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./CameraReceivedLog.json";
import detailDialog from "./components/detailDialog";
import ImageDetailDialog from "@/components/ImageDetailDialog";
import LogsDialog from "./components/LogDialog";
import * as api from "@/api/cameraLogs";

export default {
  components: {
    ListPresenter,
    detailDialog,
    ImageDetailDialog,
    LogsDialog,
  },
  data() {
    return {
      fields,
      showDialog: false,
      isListRefresh: false,
      imgDialog: {
        check: false,
        imgItem: [],
      },
      // 接收日志内容
      recivedLog: {
        logStr: "",
        check: false,
      },
      detailLog: {
        data: {},
        check: false,
      },
      // 标记图Dialog
      markImgDialog: {
        data: null,
        check: false,
      },
    };
  },
  methods: {
    /**
     * 查看标记图
     */
    onMarkImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.eventId,
          imageTypeCode: 1,
        })
        .then((data) => {
          this.markImgDialog.data = data;
          this.markImgDialog.check = true;
        });
    },
    /**
     * 行操作: 查看图片
     */
    onCheckImages(row) {
      api
        .viewImage({
          eventId: row.eventId,
        })
        .then((data) => {
          this.imgDialog.imgItem = data;
          this.imgDialog.check = true;
        });
    },
    /**
     * 行操作: 查看日志
     */
    onCheckLog(row) {
      const { id } = row;
      const parkId = this.$store.getters.userParkId;
      api.getDetail({ id, parkId }).then((data) => {
        this.detailLog.data = data;
        this.detailLog.check = true;
      });
    },
    /**
     * toolbar: 查看详细日志
     */
    onCheckDetailLog(row) {
      const { originalInfo } = row;
      this.recivedLog.logStr = originalInfo;
      this.recivedLog.check = true;
    },
    /**
     * 导出
     */
    onExport(data) {
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, "高位相机接收日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
