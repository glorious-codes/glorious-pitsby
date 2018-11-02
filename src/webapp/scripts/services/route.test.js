describe('Route Service', () => {
  let service, $state;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      $state = $injector.get('$state');
      service = $injector.get('routeService');
    });
    $state.get = jest.fn();
  });

  it('should get all routes', () => {
    service.getAllRoutes();
    expect($state.get).toHaveBeenCalled();
  });
});
