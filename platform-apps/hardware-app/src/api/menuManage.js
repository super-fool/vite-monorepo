import request from '../utils/request';
// 获取菜单树
export function getMenuTree(query) {
  return request({
    url: '/manage/menu/menuTree',
    method: 'get',
    params: query
  });
}
// 获取分页菜单节点列表
export function getMenuList(data) {
  return request({
    url: '/manage/menu/searchMenu',
    method: 'post',
    data: data
  });
}

// 获取所有菜单节点列表
export function getAllMenu(query) {
  return request({
    url: '/manage/menu/getAllMenu',
    method: 'get',
    params: query
  });
}
// 新增
export function addData(data) {
  return request({
    url: '/manage/menu/addMenu',
    method: 'post',
    data: data
  });
}

// 编辑
export function editData(data) {
  return request({
    url: '/manage/menu/editMenu',
    method: 'post',
    data: data
  });
}

// 删除
export function delData(query) {
  return request({
    url: '/manage/menu/deleteMenu',
    method: 'get',
    params: query
  });
}
