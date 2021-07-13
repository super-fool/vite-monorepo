import { Route } from "vue-router";
import store from '@/store';


type CheckLogin = (to: Route) => any

const checkLogin: CheckLogin = ({ name, query, path }) => {
  const userInfo = window.localStorage.getItem('userInfo') || null;
  if (!userInfo && name !== "Login") {
    return { name: 'Login', query };
  }
};

const checkFullLayout = (query: any = {}) => {
  if (query.fullLayout) {
    store.dispatch('menu/setFullLayout', Number.parseInt(query.fullLayout));
  }
}

export function setGurd(to: Route) {
  const { query, path } = to;
  if (query.token) {
    checkFullLayout(query);
    return {
      path: '/login',
      query: { itoken: query.token, redirect: to.path }
    }
  } else {
    checkLogin(to);
  }
}
