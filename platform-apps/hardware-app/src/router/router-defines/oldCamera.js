export const oldCameraRouter = [
  // 相机管理
  {
    path: 'CameraAuditConfig',
    name: 'CameraAuditConfig',
    component: () => import('@/views/camera/camera-config/index'),
    meta: { title: '相机巡检配置' }
  },
  // 相机管理
  {
    path: 'CameraManage',
    name: 'CameraManage',
    component: () => import('@/views/camera/camera-manage/index'),
    meta: { title: '高位相机管理' }
  },
  // 接收日志
  {
    path: 'CameraLogs',
    name: 'CameraLogs',
    component: () => import('@/views/camera/camera-received-log/index'),
    meta: { title: '高位相机接收日志' }
  },
  // 离线日志
  {
    path: 'CameraOffLineLog',
    name: 'CameraOffLineLog',
    component: () => import('@/views/camera/camera-offline-log/CameraOffLineLog'),
    meta: { title: '相机离线日志' }
  },
  // 发送日志
  {
    path: 'PlatformSendLogs',
    name: 'PlatformSendLogs',
    component: () => import('@/views/camera/platform-send-log/index'),
    meta: { title: '硬件平台发送日志' }
  },
];