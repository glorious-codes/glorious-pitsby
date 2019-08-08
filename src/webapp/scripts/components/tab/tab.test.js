describe('Tab', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}, content = '') => {
        const template = `<p-tab
                            data-on-select="$ctrl.onSelect">
                            ${content}
                          </p-tab>`;
        const element = $compile(template)(scope);
        scope.$ctrl = bindings;
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-tab');
  });

  it('should transclude some component', () => {
    const element = compile({}, '<p>Hello</p>');
    expect(element.find('p').text()).toEqual('Hello');
  });

  it('should execute selection callback on select', () => {
    const callback = jest.fn();
    const element = compile({ onSelect: callback });
    element.isolateScope().$ctrl.select();
    expect(callback).toHaveBeenCalled();
  });
});
