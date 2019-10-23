describe('Required Symbol', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const element = $compile('<p-required-symbol>')(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('span').attr('class')).toEqual('p-required-symbol');
  });

  it('should contain a required symbol', () => {
    const element = compile();
    expect(element.find('span').text().trim()).toEqual('*');
  });
});
