<template>
  <ListPresenter
    v-bind="fields"
    query-url="/manage/manage/camera/page"
    :refresh="isListRefresh"
    :onAdd="onAdd"
    :onBatchDelete="onDelete"
    :isMultiSelect="true"
  >
    <!-- 额外的model -->
    <template #dialogs>
      <addHightDialog
        :dialogVisible.sync="hightCameraVisible"
        @form-submit="searchData"
      />
      <editDialog
        :dialogVisible.sync="editVisible"
        :data-item="dataItem"
        @form-submit="searchData"
      ></editDialog>
    </template>
    <!-- 行操作 按钮-->
    <template #rowaction="scope">
      <el-button type="text" @click="editData(scope.row)">编辑</el-button>
      <el-button type="text" class="danger-btn" @click="onDelete([scope.row])"
        >删除</el-button
      >
    </template>
  </ListPresenter>
</template>

<script>
import ListPresenter from "@solution/list-solution";
import fields from "./cameraManage.json";
import * as api from "@/api/cameraManage";
import editDialog from "./components/editDialog";
import addHightDialog from "./components/addHightDialog";

export default {
  components: { ListPresenter, editDialog, addHightDialog },
  data() {
    return {
      fields,
      showDialog: false,
      isListRefresh: false,
      imgDetailVisible: false,
      imgItem: [],
      hightCameraVisible: false,
      // 接收日志内容
      dataItem: null,
      editVisible: false,
    };
  },
  methods: {
    editData(row) {
      this.dataItem = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
    },
    onAdd() {
      this.hightCameraVisible = true;
    },
    searchData() {
      this.isListRefresh = !this.isListRefresh;
    },
    onDelete(row) {
      if (Array.isArray(row) && row.length === 0) {
        this.$message.warning("请选中需要删除的相机");
        return;
      }
      const { parkCode, id } = this.$store.getters.parkLotObj;
      let param = {
        cameraCode: row.map((val) => val.cameraCode).join(","),
        parkCode: parkCode,
        parkId: id,
      };
      this.$confirm("请确认是否删除高位相机", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        api.delData(param).then(() => {
          this.$message.success("删除相机成功");
          this.searchData();
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
</style>
