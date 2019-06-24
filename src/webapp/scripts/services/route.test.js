import routePathService from '@scripts/services/route-path';

describe('Route Service', () => {
  let service, $window, $state, $stateParams;

  function mockCurrentRouteParams(params){
    Object.keys(params).forEach(param => {
      $stateParams[param] = params[param];
    });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      $window = $injector.get('$window');
      $state = $injector.get('$state');
      $stateParams = $injector.get('$stateParams');
      service = $injector.get('routeService');
    });
    $state.get = jest.fn();
    $state.go = jest.fn();
  });

  it('should get all routes', () => {
    service.getAllRoutes();
    expect($state.get).toHaveBeenCalled();
  });

  it('should go to some route', () => {
    const route = 'some-route';
    const params = {some: 'params'};
    const options = {some: 'options'};
    service.go(route, params, options);
    expect($state.go).toHaveBeenCalledWith(route, params, options);
  });

  it('should optionally reset url path when going to some route', () => {
    const routesMock = [{name: 'x', url: 'y'}];
    const routeName = 'rotueName';
    const routeParams = {id: '123'};
    $state.get = jest.fn(() => routesMock);
    routePathService.build = jest.fn(() => '/some/path');
    service.go(routeName, routeParams, { resetUrlPath: true });
    expect(routePathService.build).toHaveBeenCalledWith(routesMock, routeName, routeParams);
    expect($window.location.hash).toEqual('#!/some/path');
  });

  it('should set search params', () => {
    const params = {name: 'rafael', email: 'some@email.com'};
    service.setParams(params);
    expect($state.go).toHaveBeenCalledWith('.', params, {
      location: 'replace'
    });
  });

  it('should get all route params', () => {
    mockCurrentRouteParams({name: 'rafael', email: 'some@email.com'});
    expect(service.getParams()).toEqual({
      name: 'rafael',
      email: 'some@email.com'
    });
  });

  it('should get specific route param', () => {
    mockCurrentRouteParams({name: 'rafael', email: 'some@email.com'});
    expect(service.getParams('name')).toEqual('rafael');
  });

  it('should identify some route as current route when route name and params match current route name and params', () => {
    const routeName = 'inbox';
    const name = 'rafael';
    const email = 'some@email.com';
    $state.current.name = routeName;
    mockCurrentRouteParams({name, email});
    expect(service.isCurrentRoute(routeName, {name, email})).toEqual(true);
    expect(service.isCurrentRoute(routeName, {name, param: 'notPresent'})).toEqual(false);
  });

  it('should not identify some route as current route when either route name or route params don\'t match current route name and params', () => {
    const routeName = 'inbox';
    const name = 'rafael';
    const email = 'some@email.com';
    $state.current.name = routeName;
    mockCurrentRouteParams({name, email});
    expect(service.isCurrentRoute('outbox', {name, email})).toEqual(false);
    expect(service.isCurrentRoute(routeName, {name, param: 'notPresent'})).toEqual(false);
  });
});
