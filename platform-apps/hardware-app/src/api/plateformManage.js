import request from '../utils/request';

//查询
export function getData(data) {
  return request({
    url: '/manage/manage/server/getServerConfigs',
    method: 'post',
    data: data
  });
}
//新增
export function addData(data) {
  return request({
    url: '/manage/manage/server/add',
    method: 'post',
    data: data
  });
}
//编辑
export function editData(data) {
  return request({
    url: '/manage/manage/server/update',
    method: 'post',
    data: data
  });
}
// 同步
export function lotData(data) {
  return request({
    url: '/manage/manage/server/getParkingsByServerId',
    method: 'post',
    data: data
  });
}
// 同步
export function syncData(data) {
  return request({
    url: '/manage/manage/server/thirdPartyInquiresParking',
    method: 'post',
    data: data
  });
}
// 查重
export function exist(query) {
  return request({
    url: '/manage/manage/parking/parking/exist',
    method: 'post',
    data: query
  });
}
