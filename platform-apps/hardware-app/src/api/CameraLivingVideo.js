import request from '../utils/request';

//获取相机信息
export function getCamera(data) {
  return request({
    url: '/manage/manage/camera/getCamera',
    method: 'get',
    params: data
  });
}
//rtmp视频流心跳保持
export function heartbeat(data) {
  return request({
    url: '/video/rtmp/heartbeat',
    method: 'get',
    params: data
  });
}
