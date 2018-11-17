describe('Welcome', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const template = '<p-welcome></p-welcome>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-welcome');
  });

  it('should have a welcome heading', () => {
    const element = compile();
    expect(element.find('h2').text()).toEqual('Welcome');
  });
});
