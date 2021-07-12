import request from '../utils/request';
// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/manage/role/page',
    method: 'post',
    data: data
  });
}
// 添加角色
export function addData(data) {
  return request({
    url: '/manage/role/addRole',
    method: 'post',
    data: data
  });
}
// 编辑角色
export function editData(data) {
  return request({
    url: '/manage/role/editRole',
    method: 'post',
    data: data
  });
}

// 删除角色
export function delData(query) {
  return request({
    url: '/manage/role/deleteRole',
    method: 'get',
    params: query
  });
}
// 根据角色获取菜单
export function getMenuByRoleId(query) {
  return request({
    url: '/manage/menu/getMenuByRoleId',
    method: 'get',
    params: query
  });
}
