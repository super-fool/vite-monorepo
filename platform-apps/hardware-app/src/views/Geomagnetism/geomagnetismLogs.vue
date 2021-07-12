<template>
  <ListPresenter
    :hidden-row-action="true"
    v-bind="fields"
    query-url="/nbiot/pushRecord/list"
    :refresh="isListRefresh"
    :on-export="onExport"
  >
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./sentLog.json";
import * as api from "@/api/geomagnetis.js";

export default {
  components: { ListPresenter },
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
     * 导出
     */
    onExport(data) {
      api.loadNbiotSendLogs(this.param).then((res) => {
        this.util.exportHandel(res, "地磁发送日志");
        this.$message.success("导出成功");
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
