<template>
  <el-dialog
    class="view-dialog"
    :title="dataItem ? '编辑节点' : '新增节点'"
    :visible.sync="dialogVisible"
    width="520px"
    :before-close="handleClose"
  >
    <el-form
      ref="editForm"
      label-position="left"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="上级节点:" prop="pid">
        <el-select v-model="form.pid" filterable placeholder="请选择">
          <el-option
            v-for="item in menuOptions"
            :key="item.id"
            :label="item.menuName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节点名称:" prop="menuName">
        <el-input
          v-model="form.menuName"
          placeholder="请输入"
          maxlength="128"
        ></el-input>
      </el-form-item>
      <el-form-item label="节点类型:" prop="menuType">
        <el-radio v-model="form.menuType" :label="0">文件夹</el-radio>
        <el-radio v-model="form.menuType" :label="1">页面</el-radio>
      </el-form-item>
      <template v-if="form.menuType !== 0">
        <el-form-item label="节点地址:" prop="componentPath">
          <el-input
            v-model="form.componentPath"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点路由:" prop="componentName">
          <el-input
            v-model="form.componentName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item label="节点排序:" prop="menuSort">
        <el-input
          v-model.number="form.menuSort"
          @keyup.native="handleInput"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否启用:" prop="enableFlag">
        <el-radio v-model="form.enableFlag" :label="true">启用</el-radio>
        <el-radio v-model="form.enableFlag" :label="false">禁用</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="sending"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getAllMenu, addData, editData } from "@/api/menuManage";
export default {
  data() {
    return {
      menuOptions: [],
      sending: false,
      form: {},
      rules: {
        menuName: [
          { required: true, message: "请填写节点名称", trigger: "blur" },
        ],
        componentName: [
          { required: true, message: "请填写节点路由", trigger: "blur" },
        ],
        componentPath: [
          { required: true, message: "请填写节点地址", trigger: "blur" },
        ],
        menuSort: [
          { required: true, message: "请填写节点顺序", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    dialogVisible: Boolean,
    dataItem: {
      type: Object,
      default() {
        return null;
      },
    },
    treeItem: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getAllMenu();
        this.$nextTick(() => {
          this.form = {
            componentName: "",
            componentPath: "",
            enableFlag: true,
            id: "",
            menuName: "",
            menuSort: null,
            menuType: 1,
            pid: "",
          };
          this.form.pid = this.treeItem ? this.treeItem.id : "";
          if (!this.dataItem) return;
          const {
            id,
            componentName,
            componentPath,
            enableFlag,
            menuName,
            menuSort,
            menuType,
            pid,
          } = this.dataItem;
          Object.assign(this.form, {
            id,
            componentName,
            componentPath,
            enableFlag,
            menuName,
            menuSort,
            menuType,
            pid,
          });
        });
      } else {
        this.$refs["editForm"].resetFields();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleInput(e) {
      this.form.menuSort = e.target.value.replace(/\D/g, "");
    },
    getAllMenu() {
      getAllMenu().then((data) => {
        this.menuOptions = data;
      });
    },
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        this.handleUpdate();
      });
    },
    handleUpdate() {
      this.sending = true;
      const apiFunc = this.dataItem ? editData : addData;
      apiFunc(this.form)
        .then(() => {
          this.form.id
            ? this.$message.success("编辑节点成功")
            : this.$message.success("新增节点成功");
          this.$emit("update:dialogVisible", false);
          this.$emit("form-submit");
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less">
.el-form-item__label {
  position: relative;
  & ::before {
    position: absolute;
    left: -10px;
  }
}
</style>
