import jsonService from '../../../../cli/services/json';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import vueComponentBuilder from '@scripts/services/vue-component-builder';

describe('External Component Preview', () => {
  let compile, angularComponentBuilder;

  function mockExample(){
    return {
      controller: 'function(){}',
      template: '<p>Hello!</p>'
    };
  }

  function mockBuiltComponentELement(component = {}){
    return angular.element(component.template || '<p></p>');
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $injector) => {
      angularComponentBuilder = $injector.get('angularComponentBuilder');
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-external-component-preview
                            data-engine="$ctrl.engine"
                            data-example="$ctrl.example">
                          </p-external-component-preview>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
      jsonService.parseFunctions = jest.fn(param => param);
      angularComponentBuilder.build = jest.fn(mockBuiltComponentELement);
      vanillaComponentBuilder.build = jest.fn(mockBuiltComponentELement);
      vueComponentBuilder.build = jest.fn();
    });
  });

  it('should have appropriate css class', () => {
    const element = compile({engine: 'angular'});
    expect(element.find('div').attr('class')).toEqual('p-external-component-preview');
  });

  it('should parse stringified function contained in example', () => {
    const exampleMock = mockExample();
    compile({engine: 'angular', example: exampleMock});
    expect(jsonService.parseFunctions).toHaveBeenCalledWith(exampleMock);
  });

  it('should build an angular component if angular is the engine of the example', () => {
    const element = compile({engine: 'angular', example: mockExample()});
    expect(element.find('p').text()).toEqual('Hello!');
  });

  it('should build a vue component if vue is the engine of the example', () => {
    const exampleMock = mockExample();
    const element = compile({engine: 'vue', example: exampleMock});
    expect(vueComponentBuilder.build).toHaveBeenCalledWith(exampleMock, element.find('div')[0]);
  });

  it('should build a vanilla component if vanilla is the engine of the example', () => {
    const exampleMock = mockExample();
    const element = compile({engine: 'vanilla', example: exampleMock});
    expect(vanillaComponentBuilder.build).toHaveBeenCalledWith(exampleMock);
    expect(element.find('p').text()).toEqual('Hello!');
  });

  it('should append example styles if example contains styles', () => {
    const stylesMock = 'p { color: red }';
    const exampleMock = mockExample();
    exampleMock.styles = stylesMock;
    const element = compile({engine: 'angular', example: exampleMock});
    expect(element.find('style')[0].innerHTML).toEqual(stylesMock);
  });
});
