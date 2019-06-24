import routePathService from '@scripts/services/route-path';

function routeService($window, $state, $stateParams){
  const _public = {};

  _public.getAllRoutes = () => {
    return $state.get();
  };

  _public.getParams = param => {
    return param ? $stateParams[param] : $stateParams;
  };

  _public.setParams = params => {
    return _public.go('.', params, {location: 'replace'});
  };

  _public.isCurrentRoute = (name, params) => {
    if(params && !currentRouteContainsParams($stateParams, params))
      return false;
    return $state.current.name === name;
  };

  _public.go = (routeName, params, options) => {
    if(options && options.resetUrlPath) {
      const routes = _public.getAllRoutes();
      return setUrlPath(routePathService.build(routes, routeName, params));
    }
    return $state.go(routeName, params, options);
  };

  function currentRouteContainsParams(routeParams, params){
    const expectedParamsKeys = Object.keys(params);
    return expectedParamsKeys.filter(param => {
      return routeParams[param] === params[param];
    }).length === expectedParamsKeys.length;
  }

  function setUrlPath(path){
    $window.location.hash = `#!${path}`;
  }

  return _public;
}

routeService.$inject = ['$window', '$state', '$stateParams'];

export default routeService;
