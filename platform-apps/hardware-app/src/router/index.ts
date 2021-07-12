
import VueRouter from 'vue-router';
// import Layout from '@/layout';
// import { mapModuleRoute } from './router-manager/mapRoute'
// import { videoDeviceRouter } from './router-defines/videoDevice';
// import { cameraRouter } from './router-defines/camera';
// import { oldCameraRouter } from './router-defines/oldCamera';
// import store from '../store/index';

// 解决重复点击路由报错的BUG
// const originalPush = VueRouter.prototype.push;
// const originalReplace = VueRouter.prototype.replace;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

const routes = [
    {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'Login' }
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/login/index'),
  //   meta: { title: 'Login' }
  // },
  // {
  //   path: '/CameraLivingVideo',
  //   name: 'CameraLivingVideo',
  //   component: () => import('@/views/CameraLivingVideo/index'),
  //   meta: { title: '实时视频',name:'camera-living-video' }
  // },
  // {
  //   path: '/',
  //   component: import('@/layout/index.vue'),
  //   children: [
  //     ...videoDeviceRouter,
  //     ...mapModuleRoute('camera', cameraRouter),
  //     ...oldCameraRouter,
  //     {
  //       path: 'MenuManage',
  //       name: 'MenuManage',
  //       component: () => import('@/views/MenuManage/index'),
  //       meta: { title: '菜单管理',name:'menu-manage' }
  //     },
  //     {
  //       path: 'RoleManage',
  //       name: 'RoleManage',
  //       component: () => import('@/views/RoleManage/index'),
  //       meta: { title: '角色管理',name:'role-manage' }
  //     },
  //     {
  //       path: 'UserManage',
  //       name: 'UserManage',
  //       component: () => import('@/views/UserManage/index'),
  //       meta: { title: '用户管理',name:'user-manage' }
  //     },
  //     {
  //       path: 'ParkingLotManage',
  //       name: 'ParkingLotManage',
  //       component: () => import('@/views/ParkingLotManage/index'),
  //       meta: { title: '车场管理',name:'parking-lot-manage' }
  //     },
  //     {
  //       path: 'LoginPageManage',
  //       name: 'LoginPageManage',
  //       component: () => import('@/views/LoginPageManage'),
  //       meta: { title: '登录页管理',name:'login-page-manage' }
  //     },
  //     {
  //       path: 'PlatformManage',
  //       name: 'PlatformManage',
  //       component: () => import('@/views/PlatformManage/index'),
  //       meta: { title: '平台管理',name:'platform-manage' }
  //     },
  //     {
  //       path: 'CameraConfigbyArea',
  //       name: 'CameraConfigbyArea',
  //       component: () => import('@/views/CameraConfigbyArea/index'),
  //       meta: { title: '按区域入出车相机配置管理',name:'camera-configby-area' }
  //     },
  //     {
  //       path: 'AuditList',
  //       name: 'AuditList',
  //       component: () => import('@/views/AuditList/index'),
  //       meta: { title: '待审核列表',name:'audit-list' }
  //     },
  //     {
  //       path: 'AuditDoneList',
  //       name: 'AuditDoneList',
  //       component: () => import('@/views/AuditDoneList/index'),
  //       meta: { title: '已审核列表',name:'audit-done-list' }
  //     },
  //     {
  //       path: 'AuditDetail',
  //       name: 'AuditDetail',
  //       component: () => import('@/views/AuditList/AuditDetail'),
  //       meta: { title: '审核详情',name:'audit-detail' }
  //     },
  //     {
  //       path: 'OnSiteInspection',
  //       name: 'OnSiteInspection',
  //       component: () => import('@/views/OnSiteInspection/index'),
  //       meta: { title: '巡检详情',name:'on-site-inspection' }
  //     },
  //     {
  //       path: 'CameraStatusList',
  //       name: 'CameraStatusList',
  //       component: () => import('@/views/CameraStatusList/index'),
  //       meta: { title: '相机状态列表',name:'camera-status-list' }
  //     },

  //     {
  //       path: 'GeomagnetismList',
  //       name: 'GeomagnetismList',
  //       component: () => import('@/views/Geomagnetism/geomagnetismList'),
  //       meta: { title: '地磁管理列表',name:'geomagnetism-list' }
  //     },
  //     {
  //       path: 'geomagnetismLogs',
  //       name: 'geomagnetismLogs',
  //       component: () => import('@/views/Geomagnetism/geomagnetismLogs'),
  //       meta: { title: '地磁发送日志',name:'geomagnetism-logs' }
  //     },
  //     {
  //       path: 'geomagnetismLogsRec',
  //       name: 'geomagnetismLogsRec',
  //       component: () => import('@/views/Geomagnetism/geomagnetismLogsRec'),
  //       meta: { title: '地磁接收日志',name:'geomagnetism-logs-rec' }
  //     },

  //     {
  //       path: '/404',
  //       name: '',
  //       component: () => import('@/views/404'),
  //       meta: { title: '404',name:'not-found' }
  //     }
  //   ]
  // },
  // {
  //   path: '/downloadPage',
  //   name: 'DownloadPage',
  //   component: () => import('@/views/download-page/index'),
  //   meta: { title: '导出' }
  // },
];

const router = new VueRouter({
  routes
});

const checkLogin = ({ name, query }, next) => {
  const userInfo = window.localStorage.getItem('userInfo') || null;
  if (!userInfo && name !== "Login") {
    next({ name: 'Login', query });
  } else {
    next();
  }
};

const checkFullLayout = (query = {}) => {
  if (query.fullLayout) {
    store.dispatch('menu/setFullLayout', Number.parseInt(query.fullLayout));
  }
}

// router.beforeEach((to, from, next) => {
//   const { query,path } = to;
//   if (query.token) {
//     checkFullLayout(query);
//     next({
//       path: '/login',
//       query: { itoken: query.token, redirect: to.path }
//     })
//     // checkNestURL(to, next);
//   }else {
//     checkLogin(to, next);
//   }
//   next()
// });


export default router;
