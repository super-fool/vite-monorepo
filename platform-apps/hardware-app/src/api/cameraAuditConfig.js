import request from '../utils/request';

//获取相机信息
export function getData(data) {
  return request({
    url: '/manage/manage/parkcamerastrategy/listCameraPatrolStrategy',
    method: 'get',
    params: data
  });
}
//获取相机信息
export function updateData(data) {
  return request({
    url: '/manage/manage/parkcamerastrategy/update',
    method: 'POST',
    data: data
  });
}
// /parkcamerastrategy/update
