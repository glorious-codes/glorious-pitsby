describe('Row Item', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}, content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-row-item
                            data-size="{{ size }}"
                            data-label="{{ label }}"
                            data-value="value">
                            ${content}
                          </p-row-item>`;
        scope.size = bindings.size;
        scope.label = bindings.label;
        scope.value = bindings.value;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-row-item')).toEqual(true);
  });

  it('should allow size option', () => {
    const element = compile({size: '3'});
    expect(element.find('div').hasClass('p-row-item-size-3')).toEqual(true);
  });

  it('should render some label', () => {
    const label = 'Label';
    const element = compile({label});
    const labelElement = element[0].querySelector('[data-row-item-label]');
    expect(labelElement.innerHTML).toEqual(label);
  });

  it('should not render some label if no label has been passed', () => {
    const element = compile();
    const labelElement = element[0].querySelector('[data-row-item-label]');
    expect(labelElement).toEqual(null);
  });

  it('should render some value', () => {
    const value = '35';
    const element = compile({value});
    const valueElement = element[0].querySelector('[data-row-item-value]');
    expect(valueElement.innerHTML).toEqual(value);
  });

  it('should not render some value if no value has been passed', () => {
    const element = compile();
    const valueElement = element[0].querySelector('[data-row-item-value]');
    expect(valueElement).toEqual(null);
  });

  it('should transclude some content', () => {
    const element = compile({}, '<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
