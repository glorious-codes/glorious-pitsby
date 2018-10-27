describe('Topbar', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const template = '<p-topbar></p-topbar>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    const rootElement = element[0].querySelector('div');
    expect(rootElement.getAttribute('class')).toEqual('p-topbar');
  });

  it('should contain a heading', () => {
    const element = compile();
    expect(element.find('h1').text().trim()).toEqual('Pitsby');
  });
});
