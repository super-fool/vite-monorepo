<template>
  <ListPresenter
    :hiddenRowAction="true"
    v-bind="fields"
    query-url="/nbiot/record/page"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
    <!-- 额外的model -->
    <template #dialogs>
      <LogsDialog
        :dialogVisible.sync="receivedLog.check"
        :data-str="receivedLog.logStr"
        :title="receivedLog.title"
      ></LogsDialog>
    </template>
    <!-- 行操作 按钮-->
    <!-- <template #rowaction="scope">
      <el-button type="text" @click="onCheckImages(scope.row)">图片</el-button>
    </template> -->
    <!-- 自定义列 Cell: v-slot后的字段使用自定义字段的表头名-->
    <template #content="{ row }">
      <el-button  type="text" @click="openDetail(row.content)">查看</el-button>
    </template>
    <template #pushStatus="{ row }">
      <el-button  type="text" :disabled="!row.pushStatus" @click="toLogs(row)">
        {{ mappingDic("IotPushStatus", Number(row.pushStatus)) }}</el-button
      >
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./receiveLog.json";
import LogsDialog from "./components/LogsDialog";
import * as api from "@/api/geomagnetis.js";

export default {
  components: { ListPresenter, LogsDialog },
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
        title: "",
      },
    };
  },
  methods: {
    toLogs(row) {
      if (row.pushStatus) {
        this.$router.push({
          path: "/geomagnetismLogs",
          query: { id: row.eventId },
        });
      }
    },
    openDetail(text) {
      this.receivedLog.check = true;
      this.receivedLog.logStr = text;
      this.receivedLog.title = "指令内容";
    },
    /**
     * 导出
     */
    onExport(data) {
      api.loadNbiotRecordLogs(data).then((res) => {
        this.util.exportHandel(res, "推送日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
