import axios from 'axios';
import Vue from 'vue';
import Store from '../store';
import { Message } from 'element-ui';
import router from '@/router';
// import { baseApi } from '../config';
import { Loading } from "element-ui";

const service = axios.create({
  // baseURL: baseApi,
  baseURL: '/api/',
  timeout: 8000
});

export const fullLoading = () => {
  const loader = Loading.service({
    fullscreen: true,
    text: "请稍后...",
    background: "rgb(13 13 13 / 50%)",
  });
  return loader;
}

service.interceptors.request.use(
  config => {
    if (Vue.prototype.util.getToken()) {
      config.headers['Authorization'] =
        'Bearer ' + Vue.prototype.util.getToken();
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }
    if (config.responseType === 'blob') {
      //导出
      config.timeout = 30 * 60 * 1000;
    }
    else {
      config.timeout = 3 * 60 * 1000;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code === 200 && res.success) {
			if(res.data !== null || res.data !== undefined){
				return res.data ;
			}else{
				return true
			}
    } else if (response.config.responseType == 'blob') {
      return res;
    } else {
      if (res.code === 403 || res.code === 401 || res.code === 1001) {
        //403无权限，401 token过期,1001未授权，
        router.replace({ name: 'Login' });
        Store.dispatch('user/logout');
        Store.dispatch('menu/removeMenu');
        Store.dispatch('tagsView/removeVisitedView');
      }
      if (document.getElementsByClassName('el-message').length === 0) {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        });
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
  },
  error => {
    if (document.getElementsByClassName('el-message').length === 0) {
      Message({
        message: '网络超时，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
