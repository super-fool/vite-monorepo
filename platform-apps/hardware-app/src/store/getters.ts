const getters = {
  visitedViews: state => state.tagsView.visitedViews,
  isAdmin: state => state.user.userInfo && state.user.userInfo.user.adminFlag,
  userInfo: state => state.user.userInfo && state.user.userInfo.user,
  parkLotObj: state => state.user.parkLotObj,
  userParkId: state => state.user.parkLotObj && state.user.parkLotObj.id,
  menuData: state => state.menu.menuData,
  menuId: state => state.menu.menuId,
  dicList: state => state.dic.dicList,
  auditClick: state => state.user.auditClick,
  fullLayout: state => state.menu.fullLayout
};
export default getters;
