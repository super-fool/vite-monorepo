<template>
  <ListPresenter
    v-bind="fields"
    query-url="/low-video/low/video/record/page"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
    <template #dialogs>
      <ImageDetailDialog
        :dialogVisible.sync="imgDetailVisible"
        :data-item="imgItem"
      ></ImageDetailDialog>
      <LogsDialog
        :dialogVisible.sync="receivedLog.check"
        :data-str="receivedLog.logStr"
      ></LogsDialog>
      <DetailDialog
        :dialogVisible.sync="detailLog.check"
        :data-item="detailLog.data"
      ></DetailDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
      <el-button type="text" @click="onCheckLog(scope.row)">日志</el-button>
    </template>

    <!-- 自定义列 Cell: v-slot后的字段使用自定义字段的表头名-->
    <template #originalInfo="{ row }">
      <el-button type="text" @click="onCheckReceivedLog(row)">查看</el-button>
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
import fields from "./receivedLog.json";
import request from "@/utils/request";
import ImageDetailDialog from "@/components/ImageDetailDialog";
import LogsDialog from "./components/LogsDialog";
import DetailDialog from "./components/DetailDialog";
import { get } from "lodash";

export default {
  components: { ListPresenter, ImageDetailDialog, LogsDialog, DetailDialog },
  data() {
    return {
      fields,
      showDialog: false,
      isListRefresh: false,
      imgDetailVisible: false,
      imgItem: [],
      // 接收日志内容
      receivedLog: {
        logStr: "",
        check: false,
      },
      detailLog: {
        data: {},
        check: false,
      },
    };
  },
  methods: {
    /**
     * 行操作: 查看图片
     */
    onCheckImages(row) {
      const { eventId } = row;
      request({
        url: "/manage/manage/camera-log/viewImage",
        method: "get",
        params: { eventId, imageTypeCode: 0 },
      }).then((data) => {
        this.imgItem = data;
        this.imgDetailVisible = true;
      });
    },
    /**
     * 行操作: 查看日志
     */
    onCheckLog(row) {
      const { id } = row;
      request({
        url: "/low-video/low/video/record/detail",
        method: "get",
        params: {
          id,
        },
      }).then((data) => {
        const roadName = get(data, "info.roadName", "");
        const parkspaceNo = get(data, "info.parkspaceNo", "");
        data.info.roadName = `${roadName}(${parkspaceNo})`;
        this.detailLog.data = data;
        this.detailLog.check = true;
      });
    },
    /**
     * toolbar: 查看接收日志
     */
    onCheckReceivedLog(row) {
      const { originalInfo } = row;
      this.receivedLog = {
        check: true,
        logStr: originalInfo,
      };
    },
    /**
     * 导出
     */
    onExport(data) {
      request({
        url: "/manage/export/low/video/record",
        method: "post",
        data,
        responseType: "blob",
      }).then((res) => {
        this.util.exportHandel(res, "接收日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
