describe('Textarea', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-textarea
                            data-value="$ctrl.value">
                          </p-textarea>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-textarea')).toEqual(true);
  });

  it('should bind some value', () => {
    const value = 'Hello!';
    const element = compile({ value });
    expect(element.find('textarea').val()).toEqual(value);
  });
});
