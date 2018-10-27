describe('List', () => {
  let compile, element;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-list>${content}</p-list>`;
        element = $compile(template)(scope);
        scope.$digest();
      };
    });
  });

  it('should have appropriate css class', () => {
    compile();
    expect(element.find('div').attr('class')).toEqual('p-list');
  });

  it('should contain a requester', () => {
    compile();
    expect(element.find('p-requester')).toBeDefined();
  });

  it('should transclude some content', () => {
    compile('<span>Item Content</span>');
    expect(element.find('span').text()).toEqual('Item Content');
  });
});
