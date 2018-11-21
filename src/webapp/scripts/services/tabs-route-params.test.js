describe('Route Service', () => {
  let service, routeService;

  function stubGetParams(params){
    routeService.getParams = jest.fn(() => JSON.stringify(params));
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      routeService = $injector.get('routeService');
      service = $injector.get('tabsRouteParamsService');
    });
    routeService.setParams = jest.fn();
  });

  it('should get tabs params', () => {
    const params = {someTabParam: 1, otherTabParam: 2};
    stubGetParams(params);
    expect(service.get()).toEqual(params);
  });

  it('should set tabs params', () => {
    const params = {someTabParam: 1, otherTabParam: 2};
    stubGetParams();
    service.set(params);
    expect(routeService.setParams).toHaveBeenCalledWith(
      {tabs: JSON.stringify(params)}
    );
  });

  it('should add new params keeping the existing ones', () => {
    const existingParams = {existing: 1};
    const params = {any: 2};
    stubGetParams(existingParams);
    service.set(params);
    expect(routeService.setParams).toHaveBeenCalledWith(
      {tabs: JSON.stringify({existing: 1, any: 2})}
    );
  });
});
