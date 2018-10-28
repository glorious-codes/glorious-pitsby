describe('External Components Viewport', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-external-components-viewport>
                            ${content}
                          </p-external-components-viewport>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-components-viewport');
  });

  it('should contain a viewport', () => {
    const element = compile();
    expect(element.find('p-viewport')).toBeDefined();
  });

  it('should contain a external components list', () => {
    const element = compile();
    expect(element.find('p-external-components-list')).toBeDefined();
  });

  it('should transclude some content', () => {
    const element = compile('<span>Item Content</span>');
    expect(element.find('span').text()).toEqual('Item Content');
  });
});
