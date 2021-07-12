
import VueRouter, { RouterOptions } from 'vue-router';
import { setGurd } from "./router-manager/navigationGurd";
import { routes } from "./router-defines/default";

const router = new VueRouter({
  routes
});

setGurd(router);

export default router;
