describe('Required Caption', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const element = $compile('<p-required-caption>')(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-required-caption');
  });

  it('should contain a required symbol', () => {
    const element = compile();
    expect(element.find('p-required-symbol').length).toEqual(1);
  });

  it('should contain a caption text', () => {
    const element = compile();
    const textElement = element[0].querySelector('[data-required-caption-text]');
    expect(textElement.textContent).toEqual('Required');
  });
});
