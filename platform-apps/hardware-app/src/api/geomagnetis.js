import request from '../utils/request';

// 获取分页菜单节点列表
export function nbiotPushRecord(data) {
  return request({
    url: '/manage/manage/nbiot-push-record/list',
    method: 'post',
    data: data
  });
}
export function getList(data) {
  return request({
    url: '/nbiot/record/page',
    method: 'post',
    data: data
  });
}
export function getSendList(data) {
  return request({
    url: '/nbiot/pushRecord/list',
    method: 'post',
    data: data
  });
}
export function getManegeList(data) {
  return request({
    url: '/nbiot/nbiot/page',
    method: 'post',
    data: data
  });
}
// 删除地磁
export function deleteData(data) {
  return request({
    url: '/nbiot/nbiot/deleteDevice',
    method: 'post',
    data: data
  });
}
// 添加地磁
export function addData(data) {
  return request({
    url: '/nbiot/nbiot/registerDevice',
    method: 'post',
    data: data
  });
}
// 批量添加地磁
export function addDataBatch(data) {
  return request({
    url: '/nbiot/nbiot/registerDeviceExcel',
    method: 'post',
    data: data
  });
}
// 下载模板
export function downloadTem(data) {
  return request({
    url: '/nbiot/nbiot/getTempUrl',
    method: 'get',
    params: data
  });
}
// 下载模板
export function deleteDataBatch(data) {
  return request({
    url: '/nbiot/nbiot/deleteDeviceList',
    method: 'post',
    data: data
  });
}
// 指令日志列表
export function querylogData(data) {
  return request({
    url: '/nbiot/nbiot/NbiotCommandList',
    method: 'post',
    data: data
  });
}
// 下发指令
export function sendInstructions(data) {
  return request({
    url: '/nbiot/nbiot/sendInstructions',
    method: 'post',
    data: data
  });
}
// 导出上传失败的excel地磁
export function loadFailList(data) {
  return request({
    url: '/manage/nbiotFailList',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
// 导出地磁接收日志
export function loadNbiotRecordLogs(data) {
  return request({
    url: '/manage/nbiotRecord',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
// 导出地磁管理
export function loadNbiotManege(data) {
  return request({
    url: '/manage/nbiot',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
// 导出地磁接受日志
export function loadNbiotSendLogs(data) {
  return request({
    url: '/manage/NbiotPushRecord',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
// 地磁配置
export function deviceConfiguration(data) {
  return request({
    url: '/nbiot/nbiot/DeviceConfiguration',
    method: 'post',
    data: data
  });
}
