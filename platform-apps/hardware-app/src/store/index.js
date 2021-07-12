import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

Vue.use(Vuex);

const modulesFiles = import.meta.glob('./modules/*.js');
const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1').replace('modules/', '');
  modules[moduleName] = import(modulePath);
  return modules;
}, {});
console.log(modules)
const store = new Vuex.Store({
  modules,
  getters,
});

export default store;
