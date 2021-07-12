<template>
  <el-dialog class="view-dialog"
             :title="modalType == 2? '作废原因选择':'无法判断原因选择'"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <header class="view-header">
      <el-form label-width="auto">
        <el-form-item label="原因：">
          <el-select v-model="reason"
                     filterable
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.code"
                       :label="item.type"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </header>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary"
                 @click="changeRemark">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import * as api from '@/api/parkingLotManage';
export default {
  data() {
    return {
      sending: false,
      // reason: this.remark,
      totalCount: 0,
      addVisible: false,
      tableData: [],
      reason: this.remark
    };
  },
  props: {
    dialogVisible: Boolean,
    modalType: Number,
    remark: String,
  },
  watch: {
    remark(val) {
      this.reason = val
    },
  },
  created() { },
  mounted() { },
  computed: {
    options() {
      return this.modalType == 2 ? this.$store.getters.dicList['AgentAuditAbandonReason'] : this.$store.getters.dicList['AgentAuditUnableReason']
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    changeRemark() {
      this.$emit('changeRemark', { reason: this.reason, modalType: this.modalType })
      this.$emit('update:dialogVisible', false);
    }
    // toAuditDetail(row) {
    //   api.addData(row).then(() => {

    //     this.$emit('update:dialogVisible', false);
    //     this.$router.push({ path: '/AuditDetail', query: { area: 1 } });
    //   })
    //     .then(() => {
    //       this.sending = false;
    //     });
    // },
  },
};
</script>
<style scoped lang="less"></style>
