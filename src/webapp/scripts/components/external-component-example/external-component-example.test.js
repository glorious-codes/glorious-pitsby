describe('External Component Example', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-example
                            data-example="example"
                            data-example-index="exampleIndex">
                          </p-external-component-example>`;
        scope.example = bindings.example || {};
        scope.exampleIndex = bindings.exampleIndex || 0;
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

  it('should build tabs query param key on initialize', () => {
    const element = compile({exampleIndex: 2});
    expect(element.find('p-tabs').attr('data-query-param-key')).toEqual(
      'externalComponentExample2Tab'
    );
  });

  it('should render a title if example title has been given', () => {
    const title = 'Example Title';
    const element = compile({example: {title}});
    expect(element.find('h4').text()).toEqual(title);
  });

  it('should not render a title if no example title has been given', () => {
    const element = compile();
    expect(element.find('h4')[0]).toEqual(undefined);
  });
});
