let routes = [];
export const registerRoute = route => routes.push(route);
export const unregisterRoute = route => routes.splice(routes.indexOf(route));

export const historyPush = path => {
  history.pushState({}, null, `#/${path}`);
  routes.forEach(route => route.forceUpdate());
};

export const historyReplace = path => {
  history.replaceState({}, null, `#/${path}`);
  routes.forEach(route => route.forceUpdate());
};

export const matchPath = (pathname = "", options) => {
  const { exact = false, path } = options;
  const pathArray = path.split("/");
  const currentPathArray = pathname.split("/");
  const params = {};

  if (exact && pathArray.length !== currentPathArray.length) {
    return null;
  }
  for (let i = 0; i < currentPathArray.length; i++) {
    if (pathArray[i] && pathArray[i].startsWith(":")) {
      params[pathArray[i].slice(1)] = currentPathArray[i];
    } else if (currentPathArray[i] !== pathArray[i]) {
      return null;
    }
  }

  return {
    path,
    url: pathname,
    params
  };
};
