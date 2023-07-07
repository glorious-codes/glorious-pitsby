describe('Topbar', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-topbar />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-topbar');
  });

  it('should contain a menu trigger', () => {
    const element = compile();
    expect(element.find('p-menu-trigger').length).toEqual(1);
  });

  it('should contain a logo', () => {
    const element = compile();
    expect(element.find('p-logo').length).toEqual(1);
  });

  it('should contain a color scheme toggler', () => {
    const element = compile();
    expect(element.find('p-color-scheme-toggler').length).toEqual(1);
  });
});
