import request from '../utils/request';

//查推送日志列表查询
export function getData(data) {
  return request({
    url: '/manage/manage/camera-push-record/list',
    method: 'post',
    data: data
  });
}

//查看图片
export function viewImage(data) {
  return request({
    url: '/manage/manage/camera-push-record/viewImage',
    method: 'get',
    params: data
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
// 发送日志导出
export function exportOutData(data) {
  return request({
    url: '/manage/cameraPushRecord',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
