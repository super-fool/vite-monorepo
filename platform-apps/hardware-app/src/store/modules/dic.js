const state = {
    dicList: window.localStorage.getItem('dicList')
      ? JSON.parse(window.localStorage.getItem('dicList'))
      : null,
  };
  
  const mutations = {
    setDicList(state, vl) {
      state.dicList = vl;
      window.localStorage.setItem('dicList', JSON.stringify(vl));
    },
  };
  
  const actions = {
    setDicList({ commit }, vl) {
      commit('setDicList', vl);
    },
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
  };
  