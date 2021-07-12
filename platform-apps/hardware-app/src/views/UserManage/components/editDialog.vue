<template>
  <el-dialog class="view-dialog"
             :title="dataItem ? '编辑用户' : '新增用户'"
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
      <el-form-item label="登录账号:"
                    prop="username">
        <el-input :disabled="dataItem ? true : false"
                  v-model="form.username"
                  maxlength="11"
                  placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户名称:"
                    prop="nickname">
        <el-input v-model="form.nickname"
                  placeholder="请输入"
                  maxlength="128"
                  :disabled="isUserExist"></el-input>
      </el-form-item>
      <el-form-item label="角色:"
                    prop="roleIds">
        <el-select v-model="form.roleIds"
                   clearable
                   filterable
                   multiple
                   collapse-tags
                   placeholder="请选择">
          <el-option :label="item.roleName"
                     v-for="item in roleOptionList"
                     :key="item.id"
                     :value="item.id">
          </el-option>
        </el-select>
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
import {
  addData,
  editData,
  getRolesByUserId,
  getRolesByParkId,
  searchByUsername,
} from '@/api/userManage';
export default {
  data() {
    var validateTel = (rule, value, callback) => {
      let reg = /^\d+$/;
      if (value.slice(0, 1) == 1 && value.length === 11 && reg.test(value)) {
        if (this.dataItem) {
          callback();
          return false;
        }
        searchByUsername({
          username: value,
          parkId: this.parkLotItem.id,
        }).then((data) => {
          let { exist, user } = data;
          this.isUserExist = false;
          if (exist) {
            callback(new Error('该用户已存在'));
          } else {
            if (user) {
              this.form.nickname = user;
              this.isUserExist = true;
            }
            callback();
          }
        });
      } else if (value === '') {
        callback(new Error('请输入登录账号'));
      } else {
        callback(new Error('请输入正确的11位手机号'));
      }
    };
    return {
      sending: false,
      isUserExist: false,
      form: {},
      roleOptionList: [],
      rules: {
        nickname: [
          { required: true, message: '请输用户名称', trigger: 'blur' },
        ],
        username: [{ required: true, validator: validateTel, trigger: 'blur' }],
        roleIds: [
          {
            type: 'array',
            required: true,
            message: '请选择至少一个角色',
            trigger: 'change',
          },
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
        this.getRolesByParkId();
        this.isUserExist = false;
        this.$nextTick(() => {
          this.form = {
            nickname: '',
            roleIds: [],
            username: '',
            parkId: this.parkLotItem.id,
          };
          if (!this.dataItem) return;
          const { id, nickname, username } = this.dataItem;
          Object.assign(this.form, { id, nickname, username });
          this.getRolesByUserId();
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
    getRolesByUserId() {
      getRolesByUserId({
        parkId: this.parkLotItem.id,
        userId: this.form.id,
      }).then((data) => {
        const arr = data || [];
        this.form.roleIds = arr.map((val) => {
          return val.id;
        });
      });
    },
    getRolesByParkId() {
      getRolesByParkId({
        parkId: this.parkLotItem.id,
      }).then((data) => {
        this.roleOptionList = data;
      });
    },
    allCheckHandel(val) {
      if (val) {
        this.$refs.menulTree.setCheckedNodes(this.treeData);
      }
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
            ? this.$message.success('编辑用户成功')
            : this.$message.success('新增用户成功');
          this.$emit('update:dialogVisible', false);
          this.$emit('form-submit');
        })
        .finally(() => {
          this.sending = false;
          if (!this.dataItem && !this.isUserExist) {
            this.$alert(
              '新增用户成功，用户初始登录密码和登录账号一致',
              '成功提示',
              {
                confirmButtonText: '确定',
              }
            );
          }
        });
    },
  },
};
</script>
<style scoped lang="less"></style>
