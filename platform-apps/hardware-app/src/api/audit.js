import request from '../utils/request';

// 已审核列表
export function findAllCheckedAgent(data) {
  return request({
    url: '/agent/audit/findAllCheckedAgent',
    method: 'post',
    data: data
  });
}
// 待审核列表
export function findAllNotCheckAgent(data) {
  return request({
    url: '/agent/audit/findAllNotCheckAgent',
    method: 'post',
    data: data
  });
}
// 获取审核区域下待审核事件
export function getEventInArea(data) {
  return request({
    url: '/agent/audit/findNotCheckAgentByArea',
    method: 'post',
    data: data
  });
}
// 获取审核中事件
export function checkAuditStatus(data) {
  return request({
    url: '/agent/audit/findCheckingEvent',
    method: 'get',
    params: data
  });
}
// 选择审核区域列表
export function getAuditArea(data) {
  return request({
    url: '/agent/audit/findAuditArea',
    method: 'post',
    data: data
  });
}
// 轮询查是否有待审核事件
export function queryNewAuditEvent(data) {
  return request({
    url: '/agent/audit/findCanAuditAgent',
    method: 'get',
    params: data
  });
}
// 获取当前事件详情
export function auditSequenceNextOne(data) {
  return request({
    url: '/agent/audit/auditSequenceNextOne',
    method: 'get',
    params: data
  });
}
// 选择区域后  确定按钮
export function saveAuditSettings(data) {
  return request({
    url: '/agent/audit/saveAuditSettings',
    method: 'post',
    data: data
  });
}
// 退出处理
export function handleQuit(data) {
  return request({
    url: '/agent/audit/handleQuit',
    method: 'get',
    params: data
  });
}
// 超时处理
export function handleTimeOut(data) {
  return request({
    url: '/agent/audit/handleTimeOut',
    method: 'get',
    params: data
  });
}
// 处理审核
export function handleAgent(data) {
  return request({
    url: '/agent/audit/handleAgent',
    timeout: 2 * 60 * 1000,
    method: 'post',
    data: data
  });
}
// 列表单条审核
export function auditOne(data) {
  return request({
    url: '/agent/audit/auditOne',
    method: 'get',
    params: data
  });
}
// 列表单条审核
export function handleIgnore(data) {
  return request({
    url: '/agent/audit/handleIgnore',
    method: 'get',
    params: data
  });
}
// 列表单条事件的状态
export function getAgentStatus(data) {
  return request({
    url: '/agent/audit/getAgentStatus',
    method: 'get',
    params: data
  });
}
// 获取进入巡检 详情页的在场车
export function enterPatrolAudit(data) {
  return request({
    url: '/agent/patrol/enterPatrolAudit',
    method: 'get',
    params: data
  });
}

// 查询用户是否开启 连续审核
export function findAuditSetting(data) {
  return request({
    url: '/agent/audit/findAuditSetting',
    method: 'post',
    data: data
  });
}
// 巡检 出车
export function outCar(data) {
  return request({
    url: '/agent/patrol/outCar',
    method: 'post',
    data: data
  });
}
// 巡检 入车
export function enterCar(data) {
  return request({
    url: '/agent/patrol/enterCar',
    method: 'post',
    data: data
  });
}
// 巡检 获取秒图
export function getSecondImg(data) {
  return request({
    url: '/agent/patrol/getSecondImg',
    method: 'get',
    params: data
  });
}
//
export function findAreaCanAuditAgentCount(data) {
  return request({
    url: '/agent/audit/findAreaCanAuditAgentCount',
    method: 'get',
    params: data
  });
}
// 巡检台列表
export function getPatrolAuditList(data) {
  return request({
    url: '/agent/patrol/getPatrolAuditList',
    method: 'post',
    data: data
  });
}
// 查看标记图片
export function viewMarkImage(data) {
  return request({
    url: '/manage/manage/image/list',
    method: 'post',
    data: data
  });
}
// 完成巡检
export function completePatrol(data) {
  return request({
    url: '/agent/patrol/completePatrol',
    method: 'post',
    data: data
  });
}
// 已审核列表导出
export function exportOutData(data) {
  return request({
    url: '/manage/agentAudit',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}

// 修改车牌
export function updatePlateNumber(data) {
  return request({
    url: '/agent/patrol/plate/update',
    method: 'post',
    data: data
  });
}
