import jsonService from '../../../../cli/services/json';

describe('External Component Preview', () => {
  let compile, angularComponentBuilder;

  function mockExample(){
    return {
      controller: 'function(){}',
      template: '<p>Hello!</p>'
    };
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
      angularComponentBuilder.build = jest.fn((component = {}) => {
        return angular.element(component.template || '<p></p>');
      });
      console.log = jest.fn();
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
    const exampleMock = mockExample();
    const element = compile({engine: 'angular', example: exampleMock});
    expect(element.find('p').text()).toEqual('Hello!');
  });

  // it('should build a vue component if vue is the engine of the example', () => {
  //
  // });
});
