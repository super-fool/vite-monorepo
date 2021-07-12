<template>
  <ListPresenter
    v-bind="fields"
    query-url="/low-video/low-video/pageList"
    :onAdd="onAddLowCamera"
    :onDelete="onDelete"
    :onBatchDelete="onDelete"
    :refresh="isListRefresh"
    :isMultiSelect="true"
  >
    <template v-slot:dialogs>
      <AddLowCameraDialog
        :afterClose="afterClose"
        :showDialog.sync="showDialog"
      />
    </template>
    <template v-slot:rowaction="scope">
      <el-button type="text" class="danger-btn" @click="onDelete(scope.row)"
        >删除</el-button
      >
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
import fields from "./queryfields.json";
import AddLowCameraDialog from "./components/AddLowCameraDialog";
import request from "@/utils/request";
export default {
  components: { ListPresenter, AddLowCameraDialog },
  data() {
    return { fields, showDialog: false, isListRefresh: false };
  },
  created() {},
  mounted() {},
  methods: {
    onAddLowCamera() {
      this.showDialog = true;
    },
    afterClose() {
      this.isListRefresh = !this.isListRefresh;
    },
    onDelete(row) {
      let delIds = [],
        parkId = "";
      if (Array.isArray(row)) {
        parkId = this.$store.getters.userParkId;
        delIds = row.reduce((arr, r) => {
          arr.push(r.id);
          return arr;
        }, []);
      } else {
        delIds.push(row.id);
        parkId = row.parkId;
      }
      this.$confirm(`请确认是否删除已勾选的设备?`, "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        request({
          url: "/low-video/low-video/removeFromPark",
          method: "post",
          data: {
            deviceId: delIds,
            parkId,
          },
        }).then((res) => {
          console.log(res);
          this.$message.success(res);
          this.afterClose();
        });
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
