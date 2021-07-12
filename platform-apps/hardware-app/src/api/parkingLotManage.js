import request from '../utils/request';

//查询
export function getData(data) {
  return request({
    url: '/manage/manage/parking/page',
    method: 'post',
    data: data
  });
}
//新增
export function addData(data) {
  return request({
    url: '/manage/manage/parking/add',
    method: 'post',
    data: data
  });
}
//编辑
export function editData(data) {
  return request({
    url: '/manage/manage/parking/update',
    method: 'post',
    data: data
  });
}
// 删除
export function delData(query) {
  return request({
    url: '/manage/manage/parking/disable',
    method: 'post',
    params: query
  });
}
// 获取未添加状态停车场
export function getNotAddParkings(query) {
  return request({
    url: '/manage/manage/parking/getNotAddParkings',
    method: 'post',
    data: query
  });
}
// 同步车场
export function syncData(query) {
  return request({
    url: '/manage/manage/parking/syncThirdRoadParkSpaces',
    method: 'post',
    data: query
  });
}
