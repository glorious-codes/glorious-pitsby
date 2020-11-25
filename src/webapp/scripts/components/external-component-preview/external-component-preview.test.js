import fyzer from '@glorious/fyzer';
import externalComponentsPreviewRenderer from '@scripts/services/external-components-preview-renderer';
import jsonService from '@scripts/services/json';

describe('External Component Preview', () => {
  let compile, angularComponentBuilder;

  function mockExample(){
    return {
      controller: 'function(){}',
      template: '<p>Hello!</p>'
    };
  }

  function getElementChildScope(element){
    return element.isolateScope();
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $timeout, $compile, $injector) => {
      angularComponentBuilder = $injector.get('angularComponentBuilder');
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-external-component-preview
                            data-engine="$ctrl.engine"
                            data-example="$ctrl.example">
                          </p-external-component-preview>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        $timeout.flush();
        scope.$digest();
        return element;
      };
      externalComponentsPreviewRenderer.destroy = jest.fn();
      externalComponentsPreviewRenderer.render = jest.fn();
      jsonService.handleFunctions = jest.fn((component) => component);
      fyzer.subscribe = jest.fn((element, onShowUp) => onShowUp());
    });
  });

  it('should have appropriate css class', () => {
    const element = compile({engine: 'angular'});
    expect(element.find('div').attr('class')).toEqual('p-external-component-preview');
  });

  it('should parse stringified function contained in example', () => {
    const example = mockExample();
    const engine = 'angular';
    compile({ engine, example });
    expect(jsonService.handleFunctions).toHaveBeenCalledWith(example, { engine });
  });

  it('should render component', () => {
    const engine = 'angular';
    const component = mockExample();
    const element = compile({ engine, example: component });
    expect(externalComponentsPreviewRenderer.render).toHaveBeenCalledWith(
      engine,
      component, {
        container: element.find('div')[0],
        scope: getElementChildScope(element),
        angularContainer: element.find('div'),
        angularComponentBuilder
      }
    );
  });

  it('should not render a component if it is below the page fold', () => {
    fyzer.subscribe = jest.fn();
    compile({engine: 'angular', example: mockExample()});
    expect(externalComponentsPreviewRenderer.render).not.toHaveBeenCalled();
  });

  it('should not render a component more than once', () => {
    fyzer.subscribe = jest.fn((element, onShowUp) => {
      onShowUp();
      onShowUp();
    });
    compile({engine: 'angular', example: mockExample()});
    expect(externalComponentsPreviewRenderer.render.mock.calls.length).toEqual(1);
  });

  it('should append example styles if example contains styles', () => {
    const stylesMock = 'p { color: red }';
    const exampleMock = mockExample();
    exampleMock.styles = stylesMock;
    const element = compile({engine: 'angular', example: exampleMock});
    expect(element.find('style')[0].innerHTML).toEqual(stylesMock);
  });

  it('should unregister itself from page fold service on destroy if example has been built', () => {
    fyzer.unsubscribe = jest.fn();
    fyzer.subscribe = jest.fn(() => '123');
    const element = compile({engine: 'angular', example: mockExample()});
    element.isolateScope().$ctrl.$onDestroy();
    expect(fyzer.unsubscribe).toHaveBeenCalledWith('123');
  });

  it('should unbuild example if it has been built', () => {
    const instanceMock = {};
    externalComponentsPreviewRenderer.render = jest.fn(() => instanceMock);
    fyzer.subscribe = jest.fn((element, onShowUp) => onShowUp());
    const element = compile({engine: 'react', example: mockExample()});
    const $ctrl = element.isolateScope().$ctrl;
    $ctrl.$onDestroy();
    expect(externalComponentsPreviewRenderer.destroy).toHaveBeenCalledWith('react', instanceMock);
  });
});
