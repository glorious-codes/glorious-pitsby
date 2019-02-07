import componentsResource from '@scripts/resources/components';
import { PromiseMock } from '@mocks/promise';

describe('External Components List', () => {
  let compile, instantiateController, routeService;

  function mockRouteParams(){
    return {
      componentId: 'page',
      engine: 'vue'
    };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $componentController, $injector) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const template = '<p-external-components-list></p-external-components-list>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
      instantiateController = () => {
        return $componentController('pExternalComponentsList');
      };
      routeService = $injector.get('routeService');
    });
    componentsResource.get = jest.fn(() => new PromiseMock('success', {}));
    routeService.getParams = jest.fn(param => mockRouteParams()[param]);
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-components-list');
  });

  it('should fetch components', () => {
    const controller = instantiateController();
    controller.fetch();
    expect(componentsResource.get).toHaveBeenCalledWith('vue');
  });

  it('should set components on fetch success', () => {
    const componentsMock = [{some: 'component'}];
    const controller = instantiateController();
    controller.fetchSuccess(componentsMock);
    expect(controller.components).toEqual(componentsMock);
  });

  it('should go to the external component route on list item click', () => {
    const controller = instantiateController();
    routeService.go = jest.fn();
    controller.onExternalComponentsListItemClick({id: 'button'});
    expect(routeService.go).toHaveBeenCalledWith('app.external-components.component', {
      engine: 'vue',
      componentId: 'button'
    }, {
      resetUrlPath: true
    });
  });

  it('should identify the active list item', () => {
    let isActive;
    const componentId = 'page';
    const controller = instantiateController();
    isActive = controller.isActiveListItem({id: componentId});
    expect(routeService.getParams).toHaveBeenCalledWith('componentId');
    expect(isActive).toEqual(true);
    isActive = controller.isActiveListItem({id: 'card'});
    expect(isActive).toEqual(false);
  });
});
