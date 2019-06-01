describe('Pre', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-pre>${content}</p-pre>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('pre').attr('class').trim()).toEqual('p-pre');
  });

  it('should transclude some content', () => {
    const element = compile('Hello!');
    expect(element.find('ng-transclude').text().trim()).toEqual('Hello!');
  });
});
