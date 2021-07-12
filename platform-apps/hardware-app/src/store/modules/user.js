const state = {
  userInfo: window.localStorage.getItem('userInfo')
    ? JSON.parse(window.localStorage.getItem('userInfo'))
    : null,
  parkLotObj: window.localStorage.getItem('parkLotObj')
    ? JSON.parse(window.localStorage.getItem('parkLotObj'))
    : null,
  auditClick: false
};

const mutations = {
  setUserInfo(state, vl) {
    state.userInfo = vl;
    window.localStorage.setItem('userInfo', JSON.stringify(vl));
  },
  setParkLot(state, vl) {
    const { isloginSet } = vl;
    state.parkLotObj = vl;
    window.localStorage.setItem('parkLotObj', JSON.stringify(vl));
    !isloginSet && location.reload();
  },
  logout(state) {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userParkId');
    localStorage.removeItem('hcpToken');
    localStorage.removeItem('parkLotObj');
    state.userInfo = null;
  },
  auditClick(state, vl) {
    state.auditClick = vl;
  }
};

const actions = {
  setUserInfo({ commit }, vl) {
    commit('setUserInfo', vl);
  },
  setParkLot({ commit }, vl) {
    commit('setParkLot', vl);
  },
  logout({ commit }, vl) {
    commit('logout', vl);
  },
  auditClick({ commit }, vl) {
    commit('auditClick', vl);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
