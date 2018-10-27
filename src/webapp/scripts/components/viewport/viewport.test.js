describe('Viewport', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-viewport>${content}</p-viewport>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-viewport');
  });

  it('should contain a topbar', () => {
    const element = compile();
    expect(element.find('p-topbar')).toBeDefined();
  });

  it('should contain a container', () => {
    const element = compile();
    expect(element.find('p-container')).toBeDefined();
  });

  it('should transclude some content', () => {
    const element = compile('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
