<template>
  <el-dialog class="view-dialog"
             :title="isDetail?'审核区域选择':'开始审核'"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <header class="view-header">
      <el-form label-width="auto">
        <el-form-item label="连续审核："
                      v-if="!isDetail">
          <el-switch v-model="param.continuousAudit"></el-switch>
        </el-form-item>
        <el-form-item label="选择审核区域：">
          <el-select v-model="param.area"
                     filterable
                     multiple
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.cameraCode"
                       :label="item.roadName + item.cameraCode"
                       :value="item.cameraCode">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </header>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary"
                 @click="toAuditDetail">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/audit';

export default {
  data() {
    return {
      sending: false,
      param: {
        continuousAudit: false,
        area: [],

      },
      addVisible: false,
      options: [],
    };
  },
  props: {
    dialogVisible: Boolean,
    continuousAudit: Boolean,
    isDetail: {
      type: Boolean,
      default: false
    },
    area: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        // this.param.area = []
        this.getAuditArea();
        !this.isDetail && this.findAuditSetting()
      }
    },
    area: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.length) {
          this.param.area = []
          val.map(item => {
            this.param.area.push(item.cameraCode)
          })
        }
      }
    },
    continuousAudit(val) {
      this.param.continuousAudit = val
    }
  },
  created() {
    !this.isDetail && this.findAuditSetting()
  },
  mounted() { },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
    toAuditDetail() {
      if (!this.param.area.length) {
        this.$message.error('请选择审核区域')
        return false
      }
      let data = []
      this.param.area.forEach(item => {
        data.push({
          cameraCode: item,
          isEnable: this.param.continuousAudit ? 1 : 0
        })
      })
      api.saveAuditSettings(data).then(() => {
        if (!this.isDetail) {
          this.$router.push({ path: '/AuditDetail' });
        } else {
          this.$emit('update:dialogVisible', false)
        }
        this.$emit('offSetting', data)
      }).then(() => {
        // this.sending = false;
      });
    },
    getAuditArea() {
      let data = { parkId: this.$store.getters.userParkId }
      // let data = { parkId: '1346766821899620353' }
      api.getAuditArea(data).then((data) => {
        data && (this.options = [{ cameraCode: 'all', isEnable: null, roadName: '全部' }, ...data])
        // this.$emit('update:dialogVisible', false);
      }).then(() => {
        // this.sending = false;
      });
    },
    findAuditSetting() {
      api.findAuditSetting({ parkId: this.$store.getters.userParkId }).then(data => {
        if (data) {
          this.param.continuousAudit = data.some(item => {
            return item.isEnable == 1
          })
        } else {
          this.param.continuousAudit = true
        }
      })
    }
  },
};
</script>
<style scoped lang="less"></style>
