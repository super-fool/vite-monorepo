import request from '../utils/request';

//查询字典
export function getDic(data) {
  return request({
    url: '/manage/parking/dic/list',
    method: 'get',
    params: data
  });
}

//获取系统配置
export function getConfig(data) {
  return request({
    url: '/manage/system/config/get',
    method: 'get',
    params: data
  });
}
//更新系统配置
export function configUpdate(data) {
  return request({
    url: '/manage/system/config/update',
    method: 'post',
    data: data
  });
}
