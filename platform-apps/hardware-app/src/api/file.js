import request from '../utils/request';

//文件查询
export function getFile(data) {
  return request({
    url: '/manage/parking/file/file',
    method: 'POST',
    data: data
  });
}
