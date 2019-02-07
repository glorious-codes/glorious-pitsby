import componentsResource from '@scripts/resources/components';

describe('External Component', () => {
  let compile, routeService;

  function mockRouteParams(){
    return {
      componentId: 'page',
      engine: 'vue'
    };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      routeService = $injector.get('routeService');
      compile = () => {
        const $componentController = $injector.get('$componentController');
        return $componentController('pExternalComponent');
      };
    });
    componentsResource.get = jest.fn();
    routeService.getParams = jest.fn(param => mockRouteParams()[param]);
  });

  it('should fetch component with component id', () => {
    const controller = compile();
    controller.fetch();
    expect(componentsResource.get).toHaveBeenCalledWith('vue', 'page');
  });

  it('should set component on fetch success', () => {
    const componentMock = {some: 'component'};
    const controller = compile();
    controller.fetchSuccess(componentMock);
    expect(controller.component).toEqual(componentMock);
  });
});
