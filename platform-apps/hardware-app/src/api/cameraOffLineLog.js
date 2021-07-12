import request from '../utils/request';

// 查询用户是否开启 连续审核
export function cameraOfflineLog(data) {
  return request({
    url: '/manage/manage/camera-offline-log/page',
    method: 'post',
    data: data
  });
}
export function exportOutData(data) {
  return request({
    url: '/manage/cameraOffline',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
