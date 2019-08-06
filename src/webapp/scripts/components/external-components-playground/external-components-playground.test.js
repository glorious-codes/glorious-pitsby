import externalComponentsPlaygroundCodeBuilder from '@scripts/services/external-components-playground-code-builder';

describe('External Components Playground', () => {
  let compile, routeService;

  function getPlaygroundController(element){
    return element.isolateScope().$ctrl;
  }

  function stubRouteService(paramsMock = {}){
    routeService.getParams = jest.fn((param) => paramsMock[param]);
  }

  function stubExternalComponentsPlaygroundCodeBuilder(code = {}){
    externalComponentsPlaygroundCodeBuilder.build = jest.fn(() => code);
  }

  function mockPlaygroundCode(){
    return {
      controller: 'return function a(){ console.log("Hello!") }',
      styles: '.class { color: blue }',
      template: '<div></div>'
    };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $injector) => {
      routeService = $injector.get('routeService');
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-external-components-playground />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    stubRouteService();
    stubExternalComponentsPlaygroundCodeBuilder();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-components-playground');
  });

  it('should set engine on initialize', () => {
    stubRouteService({ engine: 'vue' });
    const element = compile();
    expect(getPlaygroundController(element).engine).toEqual('vue');
  });

  it('should render preview by default on initialize', () => {
    stubExternalComponentsPlaygroundCodeBuilder(mockPlaygroundCode());
    console.log = jest.fn();
    const element = compile();
    const controller = getPlaygroundController(element);
    controller.preview.controller();
    expect(controller.controller).toEqual('return function a(){ console.log("Hello!") }');
    expect(controller.template).toEqual('<div></div>');
    expect(controller.styles).toEqual('.class { color: blue }');
    expect(console.log).toHaveBeenCalledWith('Hello!');
    expect(controller.shouldShowPreview).toEqual(true);
  });

  it('should be able to destroy render preview', () => {
    const element = compile();
    const controller = getPlaygroundController(element);
    controller.destroyPreview();
    expect(controller.shouldShowPreview).toEqual(false);
  });
});
