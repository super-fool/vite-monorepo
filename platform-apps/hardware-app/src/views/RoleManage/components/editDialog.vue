<template>
  <el-dialog class="view-dialog"
             :title="dataItem ? '编辑角色' : '新增角色'"
             :visible.sync="dialogVisible"
             width="520px"
             :before-close="handleClose">
    <el-form ref="editForm"
             label-position="left"
             :model="form"
             :rules="rules"
             label-width="100px">
      <el-form-item label="所属车场:">
        <el-input v-if="parkLotItem"
                  v-model="parkLotItem.parkName"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称:"
                    prop="roleName">
        <el-input v-model="form.roleName"
                  placeholder="请输入"
                  maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="角色描述:"
                    prop="description">
        <el-input v-model="form.description"
                  placeholder="请输入"
                  type="textarea"
                  :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="权限选择:">
        <el-checkbox v-model="allChecked"
                     @change="allCheckHandel">全选</el-checkbox>
        <el-tree class="tree-select-box"
                 v-if="dialogVisible"
                 ref="menulTree"
                 :data="treeData"
                 :props="treeProps"
                 node-key="id"
                 default-expand-all
                 show-checkbox
                 @check-change="handleCheckChange">
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm"
                 :loading="sending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getMenuTree } from '@/api/menuManage';
import { addData, editData, getMenuByRoleId } from '@/api/roleManage';
export default {
  data() {
    return {
      sending: false,
      form: {
        description: '',
        menuIds: [],
        parkId: '',
        roleName: '',
      },
      treeProps: {
        label: 'menuName',
        children: 'childMenus',
      },
      allChecked: false,
      treeData: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
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
    parkLotItem: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getMenuTree();
        this.allChecked = false;
        this.$nextTick(() => {
          this.form = {
            description: '',
            menuIds: [],
            roleName: '',
            parkId: this.parkLotItem.id,
          };
          if (!this.dataItem) return;
          const { id, roleName, description } = this.dataItem;
          Object.assign(this.form, { id, roleName, description });
          this.getMenuByRoleId();
        });
      } else {
        this.$refs['editForm'].resetFields();
      }
    },
  },
  created() { },
  mounted() { },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    getMenuByRoleId() {
      getMenuByRoleId({
        roleId: this.form.id,
      }).then((data) => {
        const list = data || [];
        let checkedArr = list.map((item) => {
          return item.id;
        });
        setTimeout(() => {
          checkedArr.forEach((value) => {
            this.$refs.menulTree.setChecked(value, true, false);
          });
        }, 500);
      });
    },
    getMenuTree() {
      getMenuTree({
        parkId: this.parkLotItem.id,
      }).then((data) => {
        this.treeData = data;
      });
    },
    allCheckHandel(val) {
      if (val) {
        this.$refs.menulTree.setCheckedNodes(this.treeData);
      } else {
        this.$nextTick(() => {
          this.$refs.menulTree.setCheckedKeys([]);
        });
      }
    },
    handleCheckChange(data, checked) {
      if (!checked) {
        this.allChecked = false;
      }
      const checkNodeList = this.$refs.menulTree.getCheckedNodes(false, true);
      this.form.menuIds = checkNodeList.map((item) => {
        return item.id;
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
            ? this.$message.success('编辑角色成功')
            : this.$message.success('新增角色成功');
          this.$emit('update:dialogVisible', false);
          this.$emit('form-submit');
        })
        .finally(() => {
          this.sending = false;
        });
    },
  },
};
</script>
<style scoped lang="less">
.tree-select-box {
  height: 300px;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
