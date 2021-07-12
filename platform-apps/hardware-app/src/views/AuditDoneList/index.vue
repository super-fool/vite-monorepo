<template>
  <ListPresenter
    v-bind="fields"
    query-url="/agent/audit/findAllCheckedAgent"
    :on-export="onExport"
  >
    <!-- 额外的model -->
    <template #dialogs>
      <ImageDetailDialog
        :dialogVisible.sync="imageDialog.check"
        :data-item="imageDialog.data"
      ></ImageDetailDialog>
      <ImageDetailDialog
        :dialogVisible.sync="markImageDialog.data"
        :data-item="markImageDialog.data"
      ></ImageDetailDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
      <el-button :disabled="scope.row.cameraType === 1" type="text" @click="onCheckMarkImages(scope.row)"
        >标记图</el-button
      >
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./AuditDoneList.json";
import ImageDetailDialog from "@/components/ImageDetailDialog";

export default {
  components: { ListPresenter, ImageDetailDialog },
  data() {
    return {
      fields,
      imageDialog: {
        data: null,
        check: false,
      },
      markImageDialog: {
        data: null,
        check: false,
      },
    };
  },
  methods: {
    /**
     * 查看图片
     */
    onCheckImages(row) {
      const { eventId } = row;
      this.request({
        url: "/manage/manage/image/list",
        method: "post",
        data: {
          eventId,
          imageTypeCode: 0,
        },
      }).then((data) => {
        this.imageDialog.data = data;
        this.imageDialog.check = true;
      });
    },
    /**
     * 查看标记图片
     */
    onCheckMarkImages(row) {
      const { eventId } = row;
      this.request({
        url: "/manage/manage/image/list",
        method: "post",
        data: {
          eventId,
          imageTypeCode: 1,
        },
      }).then((data) => {
        this.markImageDialog.data = data;
        this.markImageDialog.check = true;
      });
    },
    /**
     * 导出
     */
    onExport(data) {
      this.request({
        url: "/manage/agentAudit",
        method: "post",
        data,
        responseType: "blob",
      }).then((res) => {
        this.util.exportHandel(res, "已审核列表");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
