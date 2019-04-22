describe('Sidebar', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-sidebar />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-sidebar');
  });

  it('should contain a logo', () => {
    const element = compile();
    expect(element.find('p-logo')).toBeDefined();
  });

  it('should contain an external componets list', () => {
    const element = compile();
    expect(element.find('p-external-components-list')).toBeDefined();
  });
});
