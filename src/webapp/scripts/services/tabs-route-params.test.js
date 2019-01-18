describe('Route Service', () => {
  let service, routeService;

  function stubGetParams(params = {}){
    routeService.getParams = jest.fn((key) => {
      if(typeof params[key] == 'string')
        return params[key];
      return JSON.stringify(params[key]);
    });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      routeService = $injector.get('routeService');
      service = $injector.get('tabsRouteParamsService');
    });
    routeService.setParams = jest.fn();
  });

  it('should get tab param value', () => {
    const params = {
      someTab: 'someValue'
    };
    stubGetParams(params);
    const tabValue = service.get('someTab');
    expect(tabValue).toEqual('someValue');
  });

  it('should get tab param value from some tab group', () => {
    const params = {
      tabGroup: {someTab: 1, otherTab: 2}
    };
    stubGetParams(params);
    const tabValue = service.get('someTab', {tabGroupKey: 'tabGroup'});
    expect(tabValue).toEqual(1);
  });

  it('should return undefined when tab value has not been found in tab group', () => {
    const params = {
      tabGroup: {someTab: 1, otherTab: 2}
    };
    stubGetParams(params);
    const tabValue = service.get('evenOtherTab', {tabGroupKey: 'tabGroup'});
    expect(tabValue).toEqual(undefined);
  });

  it('should return undefined when tab group has not been found in params', () => {
    const params = {
      tabGroup: {someTab: 1, otherTab: 2}
    };
    stubGetParams(params);
    const tabValue = service.get('evenOtherTab', {tabGroupKey: 'otherGroup'});
    expect(tabValue).toEqual(undefined);
  });

  it('should set tab param value', () => {
    stubGetParams({});
    service.set('someTab', 'someValue');
    expect(routeService.setParams).toHaveBeenCalledWith({
      someTab: 'someValue'
    });
  });

  it('should set tab value in a tab group param', () => {
    const params = {
      tabGroup: {}
    };
    stubGetParams(params);
    service.set('someTab', 'someValue', {tabGroupKey: 'tabGroup'});
    expect(routeService.setParams).toHaveBeenCalledWith({
      tabGroup: JSON.stringify({someTab: 'someValue'})
    });
  });

  it('should keep existing values when setting tab value in a tab group param', () => {
    const params = {
      tabGroup: {otherTab: 'otherValue'}
    };
    stubGetParams(params);
    service.set('someTab', 'someValue', {tabGroupKey: 'tabGroup'});
    expect(routeService.setParams).toHaveBeenCalledWith({
      tabGroup: JSON.stringify({otherTab: 'otherValue', someTab: 'someValue'})
    });
  });

  it('should clear tab param value', () => {
    service.clearTabValue('someTab');
    expect(routeService.setParams).toHaveBeenCalledWith({someTab: ''});
  });

  it('should clear tab group param value', () => {
    service.clearTabGroupValue('tabGroup');
    expect(routeService.setParams).toHaveBeenCalledWith({tabGroup: JSON.stringify({})});
  });
});
