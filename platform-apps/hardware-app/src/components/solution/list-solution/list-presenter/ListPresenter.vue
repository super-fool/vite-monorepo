<template>
  <div class="list-layout">
    <QueryForm :query-fields="queryFields" :query-form-data="formData" />
    <ToolBar :query="onQuery" :onAdd="onAdd" :query-fields="queryFields">
      <template #toolBar>
        <el-button
          v-if="typeof onQuery === 'function'"
          class="btn"
          type="primary"
          @click="onQuery"
          >查询</el-button
        >
        <el-button
          v-if="typeof onAdd === 'function'"
          class="btn"
          type="primary"
          @click="onAdd"
          >新增</el-button
        >
        <el-button
          v-if="typeof onBatchDelete === 'function'"
          class="btn"
          type="primary"
          @click="() => onBatchDelete(selectedData)"
          >批量删除</el-button
        >
        <el-button
          v-if="typeof onExport === 'function'"
          class="btn"
          type="primary"
          @click="onExport(queryListData)"
          >导出</el-button
        >
        <slot name="toolBar"></slot>
      </template>
    </ToolBar>
    <ListPage
      :hidden-row-action="hiddenRowAction"
      :list-fields="listFields"
      :list-data="listData"
      :page-size="pageSize"
      :current-page="currentPageNum"
      :page-total="pageTotal"
      :on-delete="onDelete"
      :on-batch-delete="onBatchDelete"
      :selectedData="selectedData"
      :onPageSizeChange="onPageSizeChange"
      :onCurrentPageNumChange="onCurrentPageNumChange"
      :isMultiSelect="isMultiSelect"
      @updateSelectedData="updateSelectedData"
    >
      <template v-for="value in customFields" #[value]="scope">
        <slot :name="value" :row="scope.row" />
      </template>
      <template #rowaction="scope">
        <slot name="rowaction" :row="scope.row" />
      </template>
    </ListPage>
    <slot name="dialogs"></slot>
  </div>
</template>

<script>
import ListPage from "../list-page/ListPage.vue";
import QueryForm from "../query-form/QueryForm.vue";
import ToolBar from "../tool-bar/ToolBar.vue";
import request from "@/utils/request";
import { clone } from "lodash";
export default {
  name: "ListPresenter",
  components: { ListPage, QueryForm, ToolBar },
  props: [
    "hiddenRowAction",
    "customFields",
    "queryFields",
    "listFields",
    "rowAction",
    "queryUrl",
    "exportObj",
    "onAdd",
    "onDelete",
    "onExport",
    "onBatchDelete",
    "refresh",
    "isMultiSelect",
  ],
  data() {
    return {
      currentPageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      listData: [],
      selectedData: [],
      formData: {},
    };
  },
  watch: {
    refresh() {
      this.getListData();
    },
  },
  computed: {
    queryListData() {
      const formData = this.convertRangeDatetoData();
      return {
        ...formData,
        parkId: this.$store.getters.userParkId,
        current: this.currentPageNum,
        size: this.pageSize,
      };
    },
  },
  created() {
    console.log(this.hiddenRowAction)
    this.initQueryFormData();
    this.getListData();
  },
  methods: {
    /**
     * 转换范围时间
     * 如果用户清空时间, 组件默认传空数组, 这里需要处理为null.
     */
    convertRangeDatetoData() {
      const queryFields = this.queryFields;
      const formData = clone(this.formData);
      const RangesDate = queryFields.filter(
        (field) => field.type === "RangeDate"
      );
      RangesDate.forEach((field) => {
        const dateData = formData[field.fieldName];
        if (Array.isArray(dateData) && dateData.length === 2) {
          formData[field.startTime] = this.$moment(dateData[0])
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss");
          formData[field.endTime] = this.$moment(dateData[1])
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss");
        } else {
          formData[field.startTime] = null;
          formData[field.endTime] = null;
        }
      });
      return formData;
    },
    /**
     * init query form data structure
     */
    initQueryFormData() {
      this.formData = this.queryFields.reduce((obj, field) => {
        const { type, fieldName, defaultValue } = field;
        // For now, just String, Refer
        switch (type) {
          case "String":
            obj[fieldName] = defaultValue || "";
            break;
          case "Refer":
            obj[fieldName] = defaultValue || null;
            break;
          case "RangeDate":
            if (field.defaultDate === "now") {
              obj[fieldName] = [
                this.$moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                this.$moment().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
              ];
            } else {
              obj[fieldName] = [];
            }
        }
        return obj;
      }, {});
    },
    updateSelectedData(selectedData) {
      this.selectedData = selectedData;
    },
    getListData() {
      request({
        url: this.queryUrl,
        method: "post",
        data: this.queryListData,
      }).then(({ records, total, current, size }) => {
        this.listData = records;
        this.pageTotal = total;
        this.pageSize = size;
        this.currentPageNum = current;
      });
    },
    onQuery() {
      // TODO: 查询时, 需初始化为第一页.
      this.currentPageNum = 1;
      this.getListData();
    },
    onPageSizeChange(size) {
      this.pageSize = size;
      this.getListData();
    },
    onCurrentPageNumChange(pageNum) {
      this.currentPageNum = pageNum;
      this.getListData();
    },
  },
};
</script>

<style lang="less" scoped>
.list-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.separate-line {
  height: 1px;
  background-color: #cfd3f9;
  width: 100%;
  margin: 0 auto;
}
</style>