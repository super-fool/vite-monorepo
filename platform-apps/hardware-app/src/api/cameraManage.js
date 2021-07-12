import request from '../utils/request';

//相机日志列表
export function getData(data) {
  return request({
    url: '/manage/manage/camera/page',
    method: 'post',
    data: data
  });
}
//添加相机
export function addData(data) {
  return request({
    url: '/manage/manage/camera/addCameraToParking',
    method: 'post',
    data: data
  });
}
//删除相机
export function delData(data) {
  return request({
    url: '/manage/manage/camera/batchDelete',
    method: 'post',
    data: data
  });
}
//获取未添加的相机
export function getUnbindList(data) {
  return request({
    url: '/manage/manage/camera/getNotAddCamera',
    method: 'post',
    data: data
  });
}
//编辑相机
export function updateData(data) {
  return request({
    url: '/manage/manage/camera/update',
    method: 'post',
    data: data
  });
}
//编辑相机
export function getCameraRoadsByQuery(data) {
  return request({
    url: '/manage/manage/camera/getCameraRoadsByQuery',
    method: 'post',
    data: data
  });
}
export function syncThirdPartyCameras(data) {
  return request({
    url: '/manage/manage/camera/syncThirdPartyCameras',
    method: 'post',
    data: data
  });
}
