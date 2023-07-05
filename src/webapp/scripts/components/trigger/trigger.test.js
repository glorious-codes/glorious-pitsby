describe('Trigger', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `
          <p-trigger
            on-click="onClick"
            data-aria-label="${bindings.ariaLabel}"
            data-icon-name="${bindings.iconName}"
          >
          </p-trigger>
        `;
        scope.onClick = bindings.onClick;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('button').attr('class')).toEqual('p-trigger');
  });

  it('should have appropriate label', () => {
    const element = compile({ ariaLabel: 'go back' });
    expect(element.find('button').attr('aria-label')).toEqual('go back');
  });

  it('should have appropriate icon', () => {
    const element = compile({ iconName: 'arrow-back' });
    expect(element.find('span').attr('class')).toEqual('p-icon p-icon-arrow-back');
  });

  it('should execute click callback if callback has been provided', () => {
    const onClick = jest.fn();
    const element = compile({ onClick });
    element.find('button').triggerHandler('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('should not execute click callback if callback has not been provided', () => {
    const onClick = jest.fn();
    const element = compile({ onClick });
    delete element.isolateScope().$ctrl.onClick;
    element.find('button').triggerHandler('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
