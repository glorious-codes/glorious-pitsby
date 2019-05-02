describe('Trigger', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = '<p-trigger on-click="onClick"></p-trigger>';
        scope.onClick = bindings.onClick;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-trigger');
  });

  it('should execute click callback if callback has been provided', () => {
    const onClick = jest.fn();
    const element = compile({ onClick });
    element.find('div').triggerHandler('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('should not execute click callback if callback has not been provided', () => {
    const onClick = jest.fn();
    const element = compile({ onClick });
    delete element.isolateScope().$ctrl.onClick;
    element.find('div').triggerHandler('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
