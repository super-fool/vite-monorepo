<template>
  <el-dialog class="view-dialog"
             title="批量添加地磁"
             :visible.sync="dialogVisible"
             width="600px"
             v-if="dialogVisible"
             :before-close="handleClose">
    <el-upload class="upload-demo"
               action="none"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :before-remove="beforeRemove"
               :on-change="onChange"
               :auto-upload="false"
               multiple
               :limit="1"
               :on-exceed="handleExceed"
               :file-list="fileList">
      <el-button size="small"
                 type="primary"
                 :disabled="fileList.length? true:false">点击上传</el-button>
      <el-button size="small"
                 type="primary"
                 @click.stop.native="downLoad">下载模板</el-button>
      <div slot="tip"
           class="el-upload__tip">上传excel文件</div>
    </el-upload>
    <span slot="footer"
          class="view-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/geomagnetis.js';
import * as vx from 'vuex';
import axios from 'axios'
export default {
  props: {
    dialogVisible: Boolean,
  },
  computed: {
    ...vx.mapGetters(['parkLotObj']),
  },
  data() {
    return {
      fileList: [],
      param: {
        file: null
      },
      formData: null
    }
  },
  watch: {
    dialogVisible(val) {
      val && (this.fileList = [])
    }
  },
  methods: {
    handlePreview() { },
    handleRemove() { },
    handleExceed() { },
    onChange(file, fileList) {
      this.fileList = fileList
      this.formData = new FormData()
      this.formData.append('file', file.raw)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fileList = []
        this.formData = null
      })
    },
    downLoad() {

      api.downloadTem({}).then((res) => {
        axios.get(res).then(res => {
          let a = document.createElement('a');
          a.download = `地磁模板.xlsx`;
          a.href = res.config.url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
      })
    },
    submit() {
      this.param.parkId = this.$store.getters.userParkId
      this.formData.append('parkId', this.$store.getters.userParkId)
      api.addDataBatch(this.formData).then((res) => {
        if (typeof (res) === 'boolean') {
          this.$message.success('批量添加成功')
          this.handleClose()
        } else {
          this.$confirm('批量添加地磁失败', '提示', {
            confirmButtonText: '下载添加结果',
            cancelButtonText: '确定',
            type: 'warning'
          }).then(() => {
            api.loadFailList({ id: res }).then(file => {
              this.util.exportHandel(file, '地磁')
              this.$message.success('下载成功')
            })
          }).catch(() => {
            this.$emit('update:dialogVisible', false);

          });
        }
        this.$emit('form-submit')
      })
    },
    handleClose() {
      this.$emit('update:dialogVisible', false);
    },
  }
}
</script>

<style lang="less" scoped>
.el-upload .el-button {
  margin-left: 0;
  margin-right: 20px;
}
.el-upload__tip {
  margin-bottom: 20px;
}
</style>