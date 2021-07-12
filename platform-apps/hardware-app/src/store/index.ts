import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import * as modules from './modules'
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    ...modules,
  },
  getters,
});

export default store;
