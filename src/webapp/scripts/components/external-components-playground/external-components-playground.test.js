import playgroundCodeSearchParamService from '@scripts/services/playground-code-search-param';
import externalComponentsPlaygroundCodeBuilder from '@scripts/services/external-components-playground-code-builder';

describe('External Components Playground', () => {
  let compile, routeService, $timeout;

  function getPlaygroundController(element){
    return element.isolateScope().$ctrl;
  }

  function stubRouteServiceParamsGet(paramsMock = {}){
    routeService.getParams = jest.fn((param) => paramsMock[param]);
  }

  function stubRouteServiceParamsSet(){
    routeService.setParam = jest.fn();
  }

  function stubExternalComponentsPlaygroundCodeBuilder(code = {}){
    externalComponentsPlaygroundCodeBuilder.build = jest.fn(() => code);
  }

  function stubPlaygroundCodeSearchParamParse(result){
    playgroundCodeSearchParamService.parse = jest.fn(() => result);
  }

  function stubPlaygroundCodeSearchParamFormat(result){
    playgroundCodeSearchParamService.stringify = jest.fn(() => result);
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
    inject(($rootScope, $compile, $injector, _$timeout_) => {
      routeService = $injector.get('routeService');
      $timeout = _$timeout_;
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-external-components-playground />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    stubRouteServiceParamsGet();
    stubExternalComponentsPlaygroundCodeBuilder();
    stubPlaygroundCodeSearchParamParse();
    stubPlaygroundCodeSearchParamFormat();
    stubRouteServiceParamsSet();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-components-playground');
  });

  it('should have padding css class if source search url param is edit-link', () => {
    stubRouteServiceParamsGet({source: 'edit-link'});
    const element = compile();
    expect(element.find('div').attr('class').includes('p-external-components-playground-padding')).toEqual(true);
  });

  it('should set engine on initialize', () => {
    stubRouteServiceParamsGet({ engine: 'vue' });
    const element = compile();
    expect(getPlaygroundController(element).engine).toEqual('vue');
  });

  it('should render template tab by default', () => {
    stubRouteServiceParamsGet({ engine: 'vue' });
    const element = compile();
    const templateTabElement = element[0].querySelector(
      '[data-external-components-playground-template-tab]'
    );
    expect(templateTabElement).toBeDefined();
  });

  it('should not render template tab if engine is React', () => {
    stubRouteServiceParamsGet({ engine: 'react' });
    const element = compile();
    const templateTabElement = element[0].querySelector(
      '[data-external-components-playground-template-tab]'
    );
    expect(templateTabElement).toEqual(null);
  });

  it('should build preview code parts with code search param on initialize when code search param has been found', () => {
    const template = '<div>Me</div>';
    const controller = 'function controller(){} return controller;';
    const styles = '.class { margin: 0; }';
    stubRouteServiceParamsGet({engine: 'vue', code: 'xyz'});
    stubPlaygroundCodeSearchParamParse({ template, controller, styles });
    const element = compile();
    const playgroundController = getPlaygroundController(element);
    expect(playgroundCodeSearchParamService.parse).toHaveBeenCalledWith('xyz');
    expect(playgroundController.template).toEqual(template);
    expect(playgroundController.controller).toEqual(controller);
    expect(playgroundController.styles).toEqual(styles);
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

  it('should set JavaScript as controller code language by default', () => {
    stubRouteServiceParamsGet({ engine: 'vue' });
    const element = compile();
    expect(element.isolateScope().$ctrl.controllerCodeLanguage).toEqual('javascript');
  });

  it('should set JSX as controller code language if engine is React', () => {
    stubRouteServiceParamsGet({ engine: 'react' });
    const element = compile();
    expect(element.isolateScope().$ctrl.controllerCodeLanguage).toEqual('jsx');
  });

  it('should set code search param on preview render', () => {
    stubPlaygroundCodeSearchParamFormat('xyz');
    const element = compile();
    const playgroundController = getPlaygroundController(element);
    const { template, controller, styles } = playgroundController;
    playgroundController.onPreviewRender();
    $timeout.flush();
    expect(playgroundCodeSearchParamService.stringify).toHaveBeenCalledWith(template, controller, styles);
    expect(routeService.setParam).toHaveBeenCalledWith('code', 'xyz');
  });

  it('should be able to destroy render preview', () => {
    const element = compile();
    const controller = getPlaygroundController(element);
    controller.onPreviewDestroy();
    expect(controller.shouldShowPreview).toEqual(false);
  });
});
