import request from '../utils/request';

//相机日志列表
export function getData(data) {
  return request({
    url: '/manage/manage/camera-log/list',
    method: 'post',
    data: data
  });
}
//查看图片
export function viewImage(data) {
  return request({
    url: '/manage/manage/camera-log/viewImage',
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
//查看视频
export function viewVideo(data) {
  return request({
    url: '/manage/manage/camera-log/viewVideo',
    method: 'get',
    params: data
  });
}
export function getDetail(data) {
  return request({
    url: '/manage/manage/camera-log/detail',
    method: 'post',
    data: data
  });
}
export function exportOutData(data) {
  return request({
    url: '/manage/cameraLog',
    method: 'post',
    data: data,
    responseType: 'blob'
  });
}
