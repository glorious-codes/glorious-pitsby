describe('External Component Properties List', () => {
  let compile;

  function mockProperties(deprecated){
    return [
      {name: 'Prop Name', required: true, type: 'Prop Type', values: 'Prop Values', deprecated}
    ];
  }

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
    const element = compile({ properties: mockProperties() });
    const propertyAttrs = element[0].querySelectorAll('p-row-item span');
    expect(propertyAttrs[0].textContent).toEqual('Prop Name');
    expect(propertyAttrs[1].textContent).toEqual('true');
    expect(propertyAttrs[2].textContent).toEqual('Prop Type');
    expect(propertyAttrs[3].textContent).toEqual('Prop Values');
  });

  it('should not show a deprecation tag by default', () => {
    const element = compile({ properties: mockProperties() });
    const propertyAttrs = element[0].querySelectorAll('p-row-item');
    expect(propertyAttrs[0].querySelectorAll('p-tag').length).toEqual(0);
  });

  it('should optionally show a deprecation tag', () => {
    const element = compile({ properties: mockProperties(true) });
    const propertyAttrs = element[0].querySelectorAll('p-row-item');
    expect(propertyAttrs[0].querySelectorAll('p-tag').length).toEqual(1);
  });
});
