import request from '../utils/request';
//获取验证码
export function getCheckCode() {
  return request({
    url: '/manage/auth/code',
    method: 'get'
  });
}
// 登录
export function authLogin(data) {
  return request({
    url: '/manage/auth/login',
    method: 'post',
    data: data
  });
}

// 获取用户信息
export function getUserInfo(query) {
  return request({
    url: '/manage/auth/info',
    method: 'get',
    params: query
  });
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/manage/user/updatePassword',
    method: 'post',
    data: data
  });
}

// 退出登录
export function logout(query) {
  return request({
    url: '/manage/auth/logout',
    method: 'get',
    params: query
  });
}

// 获取用户下车场
export function getUserParking(data) {
  return request({
    url: '/manage/user/getUserParking',
    method: 'post',
    data: data
  });
}
// 用户选择车场
export function selectParking(query) {
  return request({
    url: '/manage/user/selectParking',
    method: 'get',
    params: query
  });
}
export function queryUserDataByToken(query) {
  return request({
    url: '/manage/api/user/login',
    method: 'get',
    params: query
  });
}
