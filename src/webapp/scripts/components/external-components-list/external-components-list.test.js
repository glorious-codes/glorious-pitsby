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
      instantiateController = bindings => {
        return $componentController('pExternalComponentsList', {}, bindings);
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

  it('should set filtered components on fetch success', () => {
    const componentsMock = [{some: 'component'}];
    const controller = instantiateController();
    controller.fetchSuccess(componentsMock);
    expect(controller.filteredComponents).toEqual(componentsMock);
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

  it('should execute click callback on list item click', () => {
    const onListItemClick = jest.fn();
    const listItem = {id: 'button'};
    const controller = instantiateController({ onListItemClick });
    routeService.go = jest.fn();
    controller.onExternalComponentsListItemClick(listItem);
    expect(onListItemClick).toHaveBeenCalledWith(listItem);
  });

  it('should not execute click callback on list item click if no callback has been provided', () => {
    const onListItemClick = jest.fn();
    const listItem = {id: 'button'};
    const controller = instantiateController({ onListItemClick });
    routeService.go = jest.fn();
    delete controller.onListItemClick;
    controller.onExternalComponentsListItemClick(listItem);
    expect(onListItemClick).not.toHaveBeenCalled();
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

  it('should filter components list by component name', () => {
    const componentsMock = [{name: 'Button'}, {name: 'Input'}];
    const controller = instantiateController();
    controller.fetchSuccess(componentsMock);
    controller.onSearchTermChange('But');
    expect(controller.filteredComponents).toEqual([{name: 'Button'}]);
  });

  it('should show all components when search term is cleared', () => {
    const componentsMock = [{name: 'Button'}, {name: 'Input'}];
    const controller = instantiateController();
    controller.fetchSuccess(componentsMock);
    controller.onSearchTermChange('');
    expect(controller.filteredComponents).toEqual(componentsMock);
  });
});
