describe('Route Service', () => {
  let service, $state, $stateParams;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
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

  it('should get all route params', () => {
    $stateParams.name = 'rafael';
    $stateParams.email = 'some@email.com';
    expect(service.getParams()).toEqual({
      name: 'rafael',
      email: 'some@email.com'
    });
  });

  it('should get specific route param', () => {
    $stateParams.name = 'rafael';
    $stateParams.email = 'some@email.com';
    expect(service.getParams('name')).toEqual('rafael');
  });
});
