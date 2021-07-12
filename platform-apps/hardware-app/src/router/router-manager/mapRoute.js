export const mapModuleRoute = (type, routes) => {
  if (Array.isArray(routes)) {
    const a = routes.map(route => ({ ...route, path: `${type}/${route.path}` }));
    return a;
  } else {
    console.log(`%c${type} module route has error in %csrc/router/router-manager/mapRoute.js`, 'color: blue', 'color: red')
    return [];
  }
}