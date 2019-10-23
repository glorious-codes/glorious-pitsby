describe('External Component Attributes List', () => {
  let compile;

  function mockAttributes(){
    return [
      {
        name: 'theme',
        type: 'String',
        values: 'primary, secondary, danger'
      }
    ];
  }

  function getParamRequriedSymbolElement(element){
    return element[0].querySelector('[data-external-component-attributes-list-param-required-symbol]');
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-attributes-list
                            data-attributes="$ctrl.attributes"
                            data-title="{{ $ctrl.title }}">
                          </p-external-component-attributes-list>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile({ attributes: [] });
    expect(element.find('div').attr('class')).toEqual('p-external-component-attributes-list');
  });

  it('should render a title', () => {
    const title = 'Attributes';
    const element = compile({ attributes: [], title });
    expect(element.find('h3').text()).toEqual(title);
  });

  it('should render attributes', () => {
    const element = compile({ attributes: mockAttributes() });
    const attrValues = element[0].querySelectorAll('[data-attribute-value]');
    expect(attrValues[0].textContent).toEqual('theme');
    expect(attrValues[1].textContent).toEqual('String');
    expect(attrValues[2].textContent).toEqual('primary, secondary, danger');
  });

  it('should not show a deprecation tag by default', () => {
    const element = compile({ attributes: mockAttributes() });
    expect(element.find('p-tag').length).toEqual(0);
  });

  it('should optionally show a deprecation tag', () => {
    const attributes = mockAttributes();
    attributes[0].deprecated = true;
    const element = compile({ attributes });
    expect(element.find('p-tag').length).toEqual(1);
  });

  it('should not show required symbol by default', () => {
    const element = compile({ attributes: mockAttributes() });
    const requiredSymbolElement = getParamRequriedSymbolElement(element);
    expect(requiredSymbolElement).toBeFalsy();
  });

  it('should show required symbol if attribute has set required as "yes"', () => {
    const attributes = mockAttributes();
    attributes[0].required = 'yes';
    const element = compile({ attributes });
    const requiredSymbolElement = getParamRequriedSymbolElement(element);
    expect(requiredSymbolElement).toBeTruthy();
  });

  it('should show required symbol if attribute has set required as "Yes"', () => {
    const attributes = mockAttributes();
    attributes[0].required = 'Yes';
    const element = compile({ attributes });
    const requiredSymbolElement = getParamRequriedSymbolElement(element);
    expect(requiredSymbolElement).toBeTruthy();
  });

  it('should show required symbol if attribute has set required as "true"', () => {
    const attributes = mockAttributes();
    attributes[0].required = true;
    const element = compile({ attributes });
    const requiredSymbolElement = getParamRequriedSymbolElement(element);
    expect(requiredSymbolElement).toBeTruthy();
  });
});
