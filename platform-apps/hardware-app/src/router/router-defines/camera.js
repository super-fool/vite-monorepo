export const cameraRouter = [
  // 相机管理
  {
    path: 'config',
    name: 'new_CameraAuditConfig',
    alias: '/CameraAuditConfig',
    component: () => import('@/views/camera/camera-config/index'),
    meta: { title: '相机巡检配置',name:'camera-config' }
  },
  // 相机管理
  {
    path: 'manage',
    name: 'new_CameraManage',
    alias: '/CameraManage',
    component: () => import('@/views/camera/camera-manage/index'),
    meta: { title: '高位相机管理',name:'camera-manage' }
  },
  // 接收日志
  {
    path: 'received-log',
    name: 'new_CameraLogs',
    alias: '/CameraLogs',
    component: () => import('@/views/camera/camera-received-log/index'),
    meta: { title: '高位相机接收日志',name:'camera-received-log' }
  },
  // 离线日志
  {
    path: 'offline-log',
    name: 'new_CameraOffLineLog',
    alias: '/CameraOffLineLog',
    component: () => import('@/views/camera/camera-offline-log/CameraOffLineLog'),
    meta: { title: '相机离线日志',name:'camera-offline-log' }
  },
  // 发送日志
  {
    path: 'sent-log',
    name: 'new_PlatformSendLogs',
    alias: '/PlatformSendLogs',
    component: () => import('@/views/camera/platform-send-log/index'),
    meta: { title: '硬件平台发送日志',name:'platform-send-log' }
  },
];