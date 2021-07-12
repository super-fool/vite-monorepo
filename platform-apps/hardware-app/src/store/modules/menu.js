const state = {
  menuData: window.localStorage.getItem('menuData')
    ? JSON.parse(window.localStorage.getItem('menuData'))
    : [],
  menuId: window.localStorage.getItem('menuId') ? window.localStorage.getItem('menuId') : '',
  fullLayout: 1
};

const mutations = {
  setSideMenu(state, vl) {
    state.menuData = vl;
    window.localStorage.setItem('menuData', JSON.stringify(vl));
  },
  setMenuId(state, vl) {
    state.menuId = vl;
    window.localStorage.setItem('menuId', vl);
  },
  removeMenu(state) {
    state.menuData = [];
    state.menuId = '';
    localStorage.removeItem('menuData');
    localStorage.removeItem('menuId');
  },
  setFullLayout(state, vl) {
    state.fullLayout = vl;
  }
};

const actions = {
  setSideMenu({ commit }, vl) {
    commit('setSideMenu', vl);
  },
  setMenuId({ commit }, vl) {
    commit('setMenuId', vl);
  },
  removeMenu({ commit }, vl) {
    commit('removeMenu', vl);
  },
  setFullLayout({ commit }, vl) {
    commit('setFullLayout', vl);
  }
};

export const menu = {
  namespaced: true,
  state,
  mutations,
  actions
};
