export const videoDeviceRouter = [
  // 视频桩管理
  {
    path: 'video-device/manage',
    name: 'manage',
    component: () => import('@/views/video-device/manage'),
    meta: { title: '视频桩管理',name:"video-device-manage" }
  },
  {
    path: 'video-device/received-log',
    name: 'received-log',
    component: () => import('@/views/video-device/received-log'),
    meta: { title: '接收日志',name:"video-device-received-log" }
  },
  {
    path: 'video-device/sent-log',
    name: 'sent-log',
    component: () => import('@/views/video-device/sent-log'),
    meta: { title: '发送日志',name:"video-device-sent-log" }
  },
  {
    path: 'video-device/strategy',
    name: 'strategy',
    component: () => import('@/views/video-device/strategy'),
    meta: { title: '设备策略',name:"video-device-strategy" }
  },
];