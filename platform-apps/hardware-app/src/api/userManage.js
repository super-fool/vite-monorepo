import request from '../utils/request';
// 获取列表
export function getDataList(data) {
  return request({
    url: '/manage/user/searchUser',
    method: 'post',
    data: data
  });
}
// 添加
export function addData(data) {
  return request({
    url: '/manage/user/addUser',
    method: 'post',
    data: data
  });
}
// 编辑
export function editData(data) {
  return request({
    url: '/manage/user/editUser',
    method: 'post',
    data: data
  });
}

// 删除
export function delData(query) {
  return request({
    url: '/manage/user/deleteUser',
    method: 'get',
    params: query
  });
}

// 获取用户拥有的角色
export function getRolesByUserId(query) {
  return request({
    url: '/manage/role/getRolesByUserId',
    method: 'get',
    params: query
  });
}

// 获取车场下角色
export function getRolesByParkId(query) {
  return request({
    url: '/manage/role/getRolesByParkId',
    method: 'get',
    params: query
  });
}

// 重置用户密码
export function resetPassword(query) {
  return request({
    url: '/manage/user/resetPassword',
    method: 'get',
    params: query
  });
}

// 根据用户账号查询用户
export function searchByUsername(query) {
  return request({
    url: '/manage/user/searchByUsername',
    method: 'get',
    params: query
  });
}
