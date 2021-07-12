<template>
  <div class="list-grid">
    <el-table
      id="grid-table"
      @cell-dblclick="onDblclick"
      class="list-table"
      :data="listData"
      :max-height="tableHeight"
      @select="onSelectRow"
      @select-all="onSelectRow"
      :header-cell-style="headerCellStyle"
      stripe
      border
    >
      <!-- multi selection column -->
      <el-table-column v-if="!!isMultiSelect" type="selection" width="60">
      </el-table-column>
      <!-- data field column -->
      <el-table-column
        v-for="value in listFields"
        :key="value.fieldName"
        :prop="value.fieldName"
        :label="value.displayName"
        show-overflow-tooltip
        min-width="90"
      >
        <template slot-scope="scope">
          <!-- refer column -->
          <span v-if="value.type === 'Refer'">
            {{ mappingDic(value.refer, scope.row[value.fieldName]) }}
          </span>
          <!-- custom column -->
          <span v-else-if="value.type === 'Custom'">
            <slot :name="value.fieldName" :row="scope.row"></slot>
          </span>
          <!-- TODO: else type will add later-->
          <span v-else>
            {{ scope.row[value.fieldName] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!hiddenRowAction"
        label="操作"
        fixed="right"
        width="200"
        max-width="200"
      >
        <template slot-scope="scope">
          <slot name="rowaction" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="list-bottom-pagination"
      background
      layout="total, sizes,prev, pager, next"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="pageTotal"
      @current-change="onCurrentPageNumChange"
      @size-change="onPageSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import $ from "jquery";
export default {
  name: "ListPage",
  props: {
    hiddenRowAction: {
      type: Boolean,
    },
    listFields: {
      type: Array,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: () => 0,
    },
    currentPage: {
      type: Number,
      default: () => 0,
    },
    pageTotal: {
      type: Number,
      default: () => 0,
    },
    onDelete: {
      type: Function,
    },
    onBatchDelete: {
      type: Function,
    },
    onPageSizeChange: {
      type: Function,
    },
    onCurrentPageNumChange: {
      type: Function,
    },
    selectedData: {
      type: Array,
      // default: () => []
    },
    isMultiSelect: {
      // 是否多选
      type: Boolean,
    },
  },
  data() {
    return {
      headerCellStyle: {
        background: "#F9FAFD",
      },
      tableHeight: 540,
    };
  },
  mounted() {},
  methods: {
    onDblclick(row, column, cell, event) {
      if (column.label === "操作") {
        return;
      }
      const clipSpan = $(cell).find("span")[0];
      const textCopied = new ClipboardJS(clipSpan, {
        text: () => clipSpan.innerText,
      });
      textCopied.on("success", (e) => {
        this.$message.success("复制成功!");
        e.clearSelection();
        textCopied.destroy();
      });
    },
    onSelectRow(selection, _) {
      this.$emit("updateSelectedData", selection);
    },
  },
};
</script>

<style lang="less" scoped>
.list-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  padding-bottom: 24px;
  justify-content: space-between;
}
.list-bottom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}
</style>

<style lang="less">
</style>