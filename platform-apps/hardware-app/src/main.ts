import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App.vue';
import store from './store';
import filters from './utils/filter';
import func from './utils/func';
import request from "@/utils/request";
import VueAMap from 'vue-amap';
import moment from 'moment';


import router from './router';
import ElementUI from 'element-ui';

Vue.use(VueRouter);


Vue.prototype.$moment = moment;
Vue.prototype.request = request;
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'c94a4c378402233bf3bcc50485e39772',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation',
    'AMap.Geocoder'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.5'
});

// 注入全局过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item]);
});
Vue.use(func);

Vue.use(ElementUI, {
  size: 'medium'
});
Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    mappingDic(list, code) {
      const data = (this.$store.getters.dicList[list] || []).find(
        item => item.code == code
      );
      return data ? data.type : '';
    }
  }
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


// //全局修改
// function transObj(msg) {
//   let obj = { duration: 5000 }
//   if (typeof msg === 'string') {
//     obj = { message: msg, ...obj }
//   } else {
//     obj = { ...obj, ...msg }
//   }
//   return obj
// }
// Vue.prototype.$message = function (msg) {
//   let obj = transObj(msg)
//   ElementUI.Message(obj)
// }
// Vue.prototype.$message.success = function (msg) {
//   let obj = transObj(msg)
//   return ElementUI.Message.success(obj)
// }
// Vue.prototype.$message.warning = function (msg) {
//   let obj = transObj(msg)
//   return ElementUI.Message.warning(obj)
// }
// Vue.prototype.$message.error = function (msg) {
//   let obj = transObj(msg)
//   return ElementUI.Message.error(obj)
// }
