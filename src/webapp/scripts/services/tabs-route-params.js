function tabsRouteParamsService(routeService){
  const _public = {};

  _public.get = (tabKey, { tabGroupKey } = {}) => {
    if(tabGroupKey)
      return findTabValueInTabGroup(tabKey, tabGroupKey);
    return routeService.getParams(tabKey);
  };

  _public.set = (tabKey, tabValue, { tabGroupKey } = {}) => {
    const key = buildParamKey(tabKey, tabGroupKey);
    const value = buildParamValue(tabKey, tabValue, tabGroupKey);
    routeService.setParams({ [key]: value });
  };

  _public.clearTabValue = tabKey => {
    clearTabValue(tabKey);
  };

  _public.clearTabGroupValue = tabGroupKey => {
    clearTabValue(tabGroupKey, {isTabGroup: true});
  };

  function findTabValueInTabGroup(tabKey, tabGroupKey){
    const tabGroup = getTabGroup(tabGroupKey);
    return tabGroup[tabKey];
  }

  function getTabGroup(tabGroupKey){
    const group = routeService.getParams(tabGroupKey);
    return group ? JSON.parse(group) : {};
  }

  function buildParamKey(tabKey, tabGroupKey){
    return tabGroupKey || tabKey;
  }

  function buildParamValue(tabKey, tabValue, tabGroupKey){
    return tabGroupKey ? mergeValues(getTabGroup(tabGroupKey), tabKey, tabValue) : tabValue;
  }

  function mergeValues(existingValues, tabKey, tabValue){
    existingValues[tabKey] = tabValue;
    return JSON.stringify(existingValues);
  }

  function clearTabValue(key, { isTabGroup } = {}){
    const value = isTabGroup ? JSON.stringify({}) : '';
    routeService.setParams({ [key]: value });
  }

  return _public;
}

tabsRouteParamsService.$inject = ['routeService'];

export default tabsRouteParamsService;
