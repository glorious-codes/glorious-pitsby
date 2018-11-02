import componentsResource from '@scripts/resources/components';

describe('External Component', () => {
  let compile, routeService;

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
  });

  it('should fetch component with component id', () => {
    const controller = compile();
    routeService.getParams = jest.fn(() => 'page');
    controller.fetch();
    expect(componentsResource.get).toHaveBeenCalledWith('page');
  });

  it('should set component on fetch success', () => {
    const componentMock = {some: 'component'};
    const controller = compile();
    controller.fetchSuccess(componentMock);
    expect(controller.component).toEqual(componentMock);
  });
});
