describe('Viewport', () => {
  let compile, element;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const template = `<p-loader></p-loader>`;
        element = $compile(template)(scope);
        scope.$digest();
      };
    });
  });

  it('should have appropriate css class', () => {
    compile();
    expect(element.find('div').attr('class')).toEqual('p-loader');
  });
});
