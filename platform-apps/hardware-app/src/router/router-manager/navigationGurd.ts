import { Route, NavigationGuardNext } from "vue-router";
import VueRouter from "vue-router"
import store from '@/store';


type CheckLogin = (to: Route, next: NavigationGuardNext) => void

const checkLogin: CheckLogin = ({ name, query }, next) => {
  const userInfo = window.localStorage.getItem('userInfo') || null;
  if (!userInfo && name !== "Login") {
    next({ name: 'Login', query });
  } else {
    next();
  }
};

const checkFullLayout = (query: any = {}) => {
  if (query.fullLayout) {
    store.dispatch('menu/setFullLayout', Number.parseInt(query.fullLayout));
  }
}

export function setGurd(router: VueRouter) {
  router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
    const { query, path } = to;
    if (query.token) {
      checkFullLayout(query);
      next({
        path: '/login',
        query: { itoken: query.token, redirect: to.path }
      })
      // checkNestURL(to, next);
    } else {
      checkLogin(to, next);
    }
    next()
  });
}
