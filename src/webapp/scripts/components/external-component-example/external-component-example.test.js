import vueComponentBuilder from '@scripts/services/vue-component-builder';

describe('External Component Example', () => {
  let compile;

  function buildExampleMock(){
    return {
      template: '',
      controller: ''
    };
  }

  function findTemplateTabInElement(element){
    const selector = '[data-external-component-example-template-tab]';
    return element[0].querySelector(selector);
  }

  beforeEach(() => {
    vueComponentBuilder.build = jest.fn();
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}, { exampleIndex = 0 } = {}) => {
        const template = `<p-external-component-example
                            data-engine="$ctrl.engine"
                            data-example="$ctrl.example"
                            data-example-index="exampleIndex">
                          </p-external-component-example>`;
        scope.$ctrl = bindings;
        scope.$ctrl.example = scope.$ctrl.example || buildExampleMock();
        scope.exampleIndex = exampleIndex;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-example');
  });

  it('should bind engine', () => {
    const element = compile({engine: 'vue'});
    expect(element.isolateScope().$ctrl.engine).toEqual('vue');
  });

  it('should build tabs query param key on initialize', () => {
    const element = compile({}, {exampleIndex: 2});
    expect(element.find('p-tabs').attr('data-query-param-key')).toEqual(
      'externalComponentExample2Tab'
    );
  });

  it('should render a title if example title has been given', () => {
    const exampleMock = buildExampleMock();
    const description = 'Example description.';
    exampleMock.description = description;
    const element = compile({example: exampleMock});
    const descriptionElement = element[0].querySelector('[data-external-component-example-description] p');
    expect(descriptionElement.textContent.trim()).toEqual(description);
  });

  it('should render a description if example description has been given', () => {
    const exampleMock = buildExampleMock();
    const title = 'Example Title';
    exampleMock.title = title;
    const element = compile({example: exampleMock});
    expect(element.find('h4').text()).toEqual(title);
  });

  it('should not render a title if no example title has been given', () => {
    const element = compile();
    expect(element.find('h4')[0]).toEqual(undefined);
  });

  it('should show template tab by default', () => {
    const element = compile();
    expect(findTemplateTabInElement(element)).toBeDefined();
  });

  it('should not show template tab if engine is React', () => {
    const element = compile({ engine: 'react' });
    expect(findTemplateTabInElement(element)).toEqual(null);
  });
});
