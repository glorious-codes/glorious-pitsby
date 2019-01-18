const _public = {};

_public.build = (routes, routeName, routeParams) => {
  let path = buildFullUrlPath(routes, routeName);
  Object.keys(routeParams).forEach(key => {
    path = path.replace(`:${key}`, routeParams[key]);
  });
  return path;
};

function buildFullUrlPath(routes, routeName){
  const pathParts = [];
  const routeNameParts = buildNestedRouteNames(routeName.split('.'));
  for (let i = 0; i < routeNameParts.length; i++)
    pathParts.push(getPathByRouteName(routes, routeNameParts[i]));
  return pathParts.join('');
}

function buildNestedRouteNames(routeNameParts){
  const parts = [];
  for (var i = 0; i < routeNameParts.length; i++) {
    const prefix = parts.length ? parts[parts.length - 1] : '';
    parts.push(concatenateNameParts(prefix, routeNameParts[i]));
  }
  return parts;
}

function concatenateNameParts(prefix, routeName){
  return [prefix, routeName].join('.').replace(/^\./,'');
}

function getPathByRouteName(routes, routeName){
  const route = findRouteByName(routes, routeName);
  return route.url.split('?')[0];
}

function findRouteByName(routes, routeName){
  return routes.find(route => {
    return route.name === routeName;
  });
}

export default _public;
