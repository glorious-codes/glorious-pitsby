describe('Paragraph', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-paragraph>${content}</p-paragraph>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('p').attr('class').trim()).toEqual('p-paragraph');
  });

  it('should transclude some content', () => {
    const element = compile('Hello!');
    expect(element.find('p').text().trim()).toEqual('Hello!');
  });
});
