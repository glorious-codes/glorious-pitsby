import textService from '@scripts/services/text';

describe('External Component Markup', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-external-component-markup
                            data-markup="{{ template }}">
                          </p-external-component-markup>`;
        scope.template = bindings.template;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    textService.normalizeIndentation = jest.fn(markup => markup);
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-markup');
  });

  it('should render component template into pre element', () => {
    const element = compile({template: '<p>Hello</p>'});
    expect(element.find('pre')[0].innerHTML).toEqual('&lt;p&gt;Hello&lt;/p&gt;');
  });
});
