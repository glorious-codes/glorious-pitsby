function tabsRouteParamsService(routeService){
  const _public = {};

  _public.get = param => {
    const params = getTabsParams();
    if(param)
      return params[param];
    return params;
  };

  _public.set = params => {
    setTabsParams(mergeParams(getTabsParams(), params));
  };

  function mergeParams(existingParams, params){
    Object.keys(params).forEach(param => {
      existingParams[param] = params[param];
    });
    return existingParams;
  }

  function getTabsParams(){
    const params = routeService.getParams('tabs');
    return params ? JSON.parse(params) : {};
  }

  function setTabsParams(params){
    routeService.setParams({tabs: JSON.stringify(params)});
  }

  return _public;
}

tabsRouteParamsService.$inject = ['routeService'];

export default tabsRouteParamsService;
