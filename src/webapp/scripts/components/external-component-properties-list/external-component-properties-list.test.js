describe('External Component Properties List', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-properties-list
                            data-properties="properties">
                          </p-external-component-properties-list>`;
        scope.properties = bindings.properties;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-properties-list');
  });

  it('should render a heading', () => {
    const element = compile();
    expect(element.find('h3').text()).toEqual('Properties');
  });

  it('should render properties', () => {
    const element = compile({
      properties: [
        {name: 'Prop Name', type: 'Prop Type', values: 'Prop Values'}
      ]
    });
    const propertyListValueElements = element[0].querySelectorAll('[data-row-item-value]');
    expect(propertyListValueElements[0].innerHTML).toEqual('Prop Name');
    expect(propertyListValueElements[1].innerHTML).toEqual('Prop Type');
    expect(propertyListValueElements[2].innerHTML).toEqual('Prop Values');
  });
});
