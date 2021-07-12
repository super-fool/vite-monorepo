const state = {
  visitedViews: [],
};

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name',
      })
    );
  },
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  },
  REMOVE_VISITED_VIEW: (state, view) => {
    state.visitedViews = [];
  },
};

const actions = {
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  delVisitedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },
  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view);
  },
  removeVisitedView({ commit }, view) {
    commit('REMOVE_VISITED_VIEW', view);
  },
};

export const tagsView = {
  namespaced: true,
  state,
  mutations,
  actions,
};
