describe('Icon', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-icon data-icon-name="${bindings.iconName || ''}" />`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('span').hasClass('p-icon')).toEqual(true);
  });

  it('should build css class according to the given icon name', () => {
    const element = compile({ iconName: 'arrow-back' });
    expect(element.find('span').hasClass('p-icon-arrow-back')).toEqual(true);
  });

  it('should build inline styles according to the given icon name', () => {
    const element = compile({ iconName: 'arrow-back' });
    expect(element.find('span').attr('style')).toContain(
      'mask-image: url("/images/icon-arrow-back.svg");'
    );
  });
});
