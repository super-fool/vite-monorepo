<template>
  <ListPresenter
    v-bind="fields"
    query-url="/low-video/low/video/pushRecord/page"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
    <!-- 额外的model -->
    <template #dialogs>
      <ImageDetailDialog
        :dialogVisible.sync="imgDetailVisible"
        :data-item="imgItem"
      ></ImageDetailDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
    </template>
    <!-- 自定义列 Cell: v-slot后的字段使用自定义字段的表头名-->
    <template #originalInfo="{ row }">
      <el-button type="text" @click="onCheckReceivedLog(row)">查看</el-button>
    </template>
    <template #roadName="{ row }">
      {{ `${row.roadName}(${row.parkspaceNo})` }}
    </template>
    <template #pushSource>
      <span>视频桩</span>
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./sentLog.json";
import ImageDetailDialog from "@/components/ImageDetailDialog";
import request from "@/utils/request";

// 接口文档地址 http://192.168.20.212:8105/low-video/doc.html#/default/%E4%BD%8E%E4%BD%8D%E8%A7%86%E9%A2%91%E5%8F%91%E9%80%81%E6%97%A5%E5%BF%97/pageUsingPOST
export default {
  components: { ListPresenter, ImageDetailDialog },
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
    };
  },
  methods: {
    /**
     * 查看图片
     */
    onCheckImages(row) {
      request({
        url: "/manage/manage/camera-log/viewImage",
        method: "get",
        params: row,
      }).then((data) => {
        this.imgItem = data;
        this.imgDetailVisible = true;
      });
    },
    /**
     * 导出
     */
    onExport(data) {
      request({
        url: "/manage/export/lowVideoPushRecord",
        method: "post",
        data,
        responseType: "blob",
      }).then((res) => {
        this.util.exportHandel(res, "推送日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
