describe('Tab', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-tab>${content}</p-tab>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-tab');
  });

  it('should transclude some component', () => {
    const element = compile('<p>Hello</p>');
    expect(element.find('p').text()).toEqual('Hello');
  });
});
