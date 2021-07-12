import request from '../utils/request';

//车场策略列表
export function getData(data) {
  return request({
    url: '/manage/manage/parkcamerastrategy/list',
    method: 'get',
    params: data
  });
}
//变更车场策略
export function updateData(data) {
  return request({
    url: '/manage/manage/parkcamerastrategy/update',
    method: 'post',
    data: data
  });
}
