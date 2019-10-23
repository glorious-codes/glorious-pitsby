import componentsResource from '@scripts/resources/components';

describe('External Component', () => {
  let compile, routeService;

  function mockRouteParams(){
    return {
      componentId: 'page',
      engine: 'vue'
    };
  }

  function getController(element){
    return element.isolateScope().$ctrl;
  }

  function getAttributesListController(element){
    return getController(element.find('p-external-component-attributes-list'));
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $injector, $compile) => {
      const scope = $rootScope.$new(true);
      routeService = $injector.get('routeService');
      compile = () => {
        const template = '<p-external-component />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    componentsResource.get = jest.fn(() => Promise.resolve({}));
    routeService.getParams = jest.fn(param => mockRouteParams()[param]);
  });

  it('should set engine on initialize', () => {
    const controller = getController(compile());
    expect(controller.engine).toEqual('vue');
  });

  it('should fetch component with component id', () => {
    compile();
    expect(componentsResource.get).toHaveBeenCalledWith('vue', 'page');
  });

  it('should set component on fetch success', () => {
    const componentMock = { some: 'component' };
    const controller = getController(compile());
    controller.fetchSuccess(componentMock);
    expect(controller.component).toEqual(componentMock);
  });

  it('should set attributes list title as Attributes if component attributes has been given', () => {
    const componentMock = { attributes: [] };
    const element = compile();
    const controller = getController(element);
    controller.fetchSuccess(componentMock);
    element.isolateScope().$digest();
    const attributesListController = getAttributesListController(element);
    expect(attributesListController.title).toEqual('Attributes');
  });

  it('should set component attributes as attributes if component attributes has been given', () => {
    const attributes = [];
    const element = compile();
    const controller = getController(element);
    controller.fetchSuccess({ attributes });
    element.isolateScope().$digest();
    const attributesListController = getAttributesListController(element);
    expect(attributesListController.attributes).toEqual(attributes);
  });

  it('should set attributes list title as Properties if component properties has been given', () => {
    const componentMock = { properties: [] };
    const element = compile();
    const controller = getController(element);
    controller.fetchSuccess(componentMock);
    element.isolateScope().$digest();
    const attributesListController = getAttributesListController(element);
    expect(attributesListController.title).toEqual('Properties');
  });

  it('should set component properties as attributes if component properties has been given', () => {
    const properties = [];
    const element = compile();
    const controller = getController(element);
    controller.fetchSuccess({ properties });
    element.isolateScope().$digest();
    const attributesListController = getAttributesListController(element);
    expect(attributesListController.attributes).toEqual(properties);
  });
});
