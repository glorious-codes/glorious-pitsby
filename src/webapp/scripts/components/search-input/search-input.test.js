describe('Search Input', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = onChange => {
        const scope = $rootScope.$new(true);
        const template = '<p-search-input on-change="onChange"></p-search-input>';
        const element = $compile(template)(scope);
        scope.onChange = onChange;
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-search-input');
  });

  it('should execute change callback with term on input change', () => {
    const onChange = jest.fn();
    const term = 'button';
    const element = compile(onChange);
    element.find('input').val('button');
    element.find('input').triggerHandler('change');
    expect(onChange).toHaveBeenCalledWith(term);
  });
});
