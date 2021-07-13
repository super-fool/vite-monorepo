import { videoDeviceRouter } from './videoDevice';
import { cameraRouter } from './camera';
import { oldCameraRouter } from './oldCamera';
import { mapModuleRoute } from '../router-manager/mapRoute'
import Layout from "@/layout/index.vue";
export const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/CameraLivingVideo',
    name: 'CameraLivingVideo',
    component: () => import('@/views/CameraLivingVideo/index.vue'),
    meta: { title: '实时视频', name: 'camera-living-video' }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'CameraManage',
        name: 'CameraManage',
        component: () => {
          const a = import('@/views/camera/camera-manage/CameraManage.vue')
          return a;
        },
        meta: { title: '高位相机管理' }
      },
      ...videoDeviceRouter,
      ...mapModuleRoute('camera', cameraRouter),
      ...oldCameraRouter,
      {
        path: 'MenuManage',
        name: 'MenuManage',
        component: () => import('@/views/MenuManage/index.vue'),
        meta: { title: '菜单管理', name: 'menu-manage' }
      },
      {
        path: 'RoleManage',
        name: 'RoleManage',
        component: () => import('@/views/RoleManage/index.vue'),
        meta: { title: '角色管理', name: 'role-manage' }
      },
      {
        path: 'UserManage',
        name: 'UserManage',
        component: () => import('@/views/UserManage/index.vue'),
        meta: { title: '用户管理', name: 'user-manage' }
      },
      {
        path: 'ParkingLotManage',
        name: 'ParkingLotManage',
        component: () => import('@/views/ParkingLotManage/index.vue'),
        meta: { title: '车场管理', name: 'parking-lot-manage' }
      },
      {
        path: 'LoginPageManage',
        name: 'LoginPageManage',
        component: () => import('@/views/LoginPageManage.vue'),
        meta: { title: '登录页管理', name: 'login-page-manage' }
      },
      {
        path: 'PlatformManage',
        name: 'PlatformManage',
        component: () => import('@/views/PlatformManage/index.vue'),
        meta: { title: '平台管理', name: 'platform-manage' }
      },
      {
        path: 'CameraConfigbyArea',
        name: 'CameraConfigbyArea',
        component: () => import('@/views/CameraConfigbyArea/index.vue'),
        meta: { title: '按区域入出车相机配置管理', name: 'camera-configby-area' }
      },
      {
        path: 'AuditList',
        name: 'AuditList',
        component: () => import('@/views/AuditList/index.vue'),
        meta: { title: '待审核列表', name: 'audit-list' }
      },
      {
        path: 'AuditDoneList',
        name: 'AuditDoneList',
        component: () => import('@/views/AuditDoneList/index.vue'),
        meta: { title: '已审核列表', name: 'audit-done-list' }
      },
      {
        path: 'AuditDetail',
        name: 'AuditDetail',
        component: () => import('@/views/AuditList/AuditDetail.vue'),
        meta: { title: '审核详情', name: 'audit-detail' }
      },
      {
        path: 'OnSiteInspection',
        name: 'OnSiteInspection',
        component: () => import('@/views/OnSiteInspection/index.vue'),
        meta: { title: '巡检详情', name: 'on-site-inspection' }
      },
      {
        path: 'CameraStatusList',
        name: 'CameraStatusList',
        component: () => import('@/views/CameraStatusList/index.vue'),
        meta: { title: '相机状态列表', name: 'camera-status-list' }
      },

      {
        path: 'GeomagnetismList',
        name: 'GeomagnetismList',
        component: () => import('@/views/Geomagnetism/geomagnetismList.vue'),
        meta: { title: '地磁管理列表', name: 'geomagnetism-list' }
      },
      {
        path: 'geomagnetismLogs',
        name: 'geomagnetismLogs',
        component: () => import('@/views/Geomagnetism/geomagnetismLogs.vue'),
        meta: { title: '地磁发送日志', name: 'geomagnetism-logs' }
      },
      {
        path: 'geomagnetismLogsRec',
        name: 'geomagnetismLogsRec',
        component: () => import('@/views/Geomagnetism/geomagnetismLogsRec.vue'),
        meta: { title: '地磁接收日志', name: 'geomagnetism-logs-rec' }
      },
      {
        path: '/404',
        name: '',
        component: () => import('@/views/404.vue'),
        meta: { title: '404', name: 'not-found' }
      }
    ]
  },
  {
    path: '/downloadPage',
    name: 'DownloadPage',
    component: () => import('@/views/download-page/DownloadPage.vue'),
    meta: { title: '导出' }
  },
];
