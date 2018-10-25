describe('List Item', () => {
  let compile, element;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-list-item>${content}</p-list-item>`;
        element = $compile(template)(scope);
        scope.$digest();
      };
    });
  });

  it('should have appropriate css class', () => {
    compile();
    expect(element.find('div').attr('class')).toEqual('p-list-item');
  });

  it('should transclude some content', () => {
    compile('<span>Item Content</span>');
    expect(element.find('span').text()).toEqual('Item Content');
  });
});
