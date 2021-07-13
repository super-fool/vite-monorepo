<template>
  <div>
      <div class="export-text">正在导出,请稍等...</div>
  </div>
</template>

<script>
	import * as api from "@/api/cameraLogs";
	import * as cameraOffLineLogApi from "@/api/cameraOffLineLog";
	import * as platformSendLogsApi from "@/api/platformSendLogs";

	import * as geomagnetisApi from "@/api/geomagnetis"
	import request from "@/utils/request";
	export default {
	name:'download-Page',
	data(){
		return {
		}
	},
	created(){
		console.log(this.$route);
		let {query} = this.$route
		let data = query.data ? JSON.parse(query.data) : {}
		let name = query.name
		this.exportsFile(name,data)
	},
	methods:{
		exportsFile(name,data){
			switch(name){
				case 'camera-received-log' :
					api.exportOutData(data).then((res) => {
							this.util.exportHandel(res,'高位相机接收日志');
							this.$message.success("导出成功");
					});    
					break
				case 'camera-offline-log' :
					cameraOffLineLogApi.exportOutData(data).then((res) => {
						this.util.exportHandel(res, '高位相机离线日志')
						this.$message.success('导出成功')
					})
					break
				case 'camera-send-log':
					platformSendLogsApi.exportOutData(data).then((res) => {
						this.util.exportHandel(res, "高位相机发送日志");
						this.$message.success("导出成功");
					});
					break
				case 'audit-done-list' :
					this.request({
						url: "/manage/agentAudit",
						method: "post",
						data,
						responseType: "blob",
					}).then((res) => {
						this.util.exportHandel(res, "已审核列表");
						this.$message.success("导出成功");
					});
					break

				case 'geomagnetism-list' :
					geomagnetisApi.loadNbiotManege(data).then(res => {
						this.util.exportHandel(res, '地磁管理')
						this.$message.success('导出成功')
					})
					break
				case 'geomagnetism-logs' :
					geomagnetisApi.loadNbiotSendLogs(data).then((res) => {
						this.util.exportHandel(res, "地磁接收日志");
						this.$message.success("导出成功");
					});
					break	
				case 'geomagnetism-logs-rec' :
					geomagnetisApi.loadNbiotRecordLogs(data).then((res) => {
						this.util.exportHandel(res, "地磁发送日志");
						this.$message.success("导出成功");
					});
					break
				case 'video-device-received-log' :
					this.request({
						url: "/manage/export/low/video/record",
						method: "post",
						data,
						responseType: "blob",
					}).then((res) => {
						this.util.exportHandel(res, "视频桩接收日志");
						this.$message.success("导出成功");
					});
					break
				case 'video-device-sent-log' :
						request({
						url: "/manage/export/lowVideoPushRecord",
						method: "post",
						data,
						responseType: "blob",
					}).then((res) => {
						this.util.exportHandel(res, "视频桩发送日志");
						this.$message.success("导出成功");
					});
					break
				case '' :
					break
					
			}
		}
	}
}
</script>

<style lang="less" scoped>
.export-text{
    margin-top: 150px;
    font-size: 30px;
    font-weight: 900;
    text-align: center;
}
</style>