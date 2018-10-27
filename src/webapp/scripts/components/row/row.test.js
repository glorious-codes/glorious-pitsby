describe('Row', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}, content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-row
                            data-vertical-offset="{{ verticalOffset }}">
                            ${content}
                          </p-row>`;
        scope.verticalOffset = bindings.verticalOffset;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-row')).toEqual(true);
  });

  it('should allow vertical offset option', () => {
    const element = compile({verticalOffset: 3});
    expect(element.find('div').hasClass('p-row-vertical-offset-3')).toEqual(true);
  });

  it('should transclude some content', () => {
    const element = compile({}, '<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
