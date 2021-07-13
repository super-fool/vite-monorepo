
import VueRouter from 'vue-router';
import { setGurd } from "./router-manager/navigationGurd";
import { routes } from "./router-defines/default";
import { Route, NavigationGuardNext } from "vue-router";
const router = new VueRouter({
  routes
});
router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  const a = setGurd(to);
  if (a) {
    next(a)
  } else {
    next();
  }
});

export default router;
