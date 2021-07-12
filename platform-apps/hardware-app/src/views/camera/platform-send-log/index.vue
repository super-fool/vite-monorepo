<template>
  <ListPresenter
    v-bind="fields"
    query-url="/manage/manage/camera-push-record/list"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
    <!-- 额外的model -->
    <template #dialogs>
      <ImageDetailDialog
        :dialogVisible.sync="imgDialog.check"
        :data-item="imgDialog.item"
      ></ImageDetailDialog>
      <ImageDetailDialog
        :dialogVisible.sync="markImgDialog.check"
        :data-item="markImgDialog.item"
      ></ImageDetailDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
      <el-button
        type="text"
        :disabled="scope.row.cameraType == 1"
        @click="onCheckMarkImgDetail(scope.row)"
        >标记图</el-button
      >
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./sentLog.json";
import ImageDetailDialog from "@/components/ImageDetailDialog";
import * as api from "@/api/platformSendLogs";

export default {
  components: { ListPresenter, ImageDetailDialog },
  data() {
    return {
      fields,
      showDialog: false,
      isListRefresh: false,
      imgDetailVisible: false,
      imgItem: [],
      // 查看图片
      imgDialog: {
        item: null,
        check: false,
      },
      // 查看标记图
      markImgDialog: {
        item: null,
        check: false,
      },
      // 接收日志内容
      receivedLog: {
        logStr: "",
        check: false,
      },
    };
  },
  methods: {
    /**
     * 查看图片
     */
    onCheckImages(row) {
      api
        .viewImage({
          eventId: row.sourceEventId,
        })
        .then((data) => {
          this.imgDialog.item = data;
          this.imgDialog.check = true;
        });
    },
    /**
     * 查看标记图
     */
    onCheckMarkImgDetail(row) {
      api
        .viewMarkImage({
          eventId: row.sourceEventId,
          imageTypeCode: 1,
        })
        .then((data) => {
          this.markImgDialog.item = data;
          this.markImgDialog.check = true;
        });
    },
    /**
     * 导出
     */
    onExport(data) {
      api.exportOutData(data).then((res) => {
        this.util.exportHandel(res, "硬件平台发送日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
