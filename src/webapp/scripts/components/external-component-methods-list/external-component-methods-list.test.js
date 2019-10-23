describe('External Component Methods List', () => {
  let compile;

  function mockMethods(){
    return [
      {
        name: 'onClick(clickFn)',
        params: [
          {
            name: 'clickFn',
            type: 'Function',
            description: 'Function to be called on button click.'
          }
        ]
      }
    ];
  }

  function getParamDetail(element, detail){
    return element[0].querySelector(`[data-external-component-methods-list-param-${detail}]`);
  }

  function getDeprecatedTagElement(element, type){
    return element[0].querySelector(`[data-external-component-methods-list-deprecated-${type}-tag]`);
  }

  function getParamRequiredSymbolElement(element){
    return element[0].querySelector('[data-external-component-methods-list-required-param-symbol]');
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-methods-list
                            data-methods="$ctrl.methods">
                          </p-external-component-methods-list>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-component-methods-list');
  });

  it('should render methods', () => {
    const element = compile({ methods: mockMethods() });
    const methodNameElement = element[0].querySelector('[data-external-component-methods-list-method-name]');
    expect(methodNameElement.textContent.trim()).toEqual('onClick(clickFn)');
  });

  it('should render params', () => {
    const element = compile({ methods: mockMethods() });
    const paramNameElement = getParamDetail(element, 'name');
    const paramTypeElement = getParamDetail(element, 'type');
    const paramDescriptionElement = getParamDetail(element, 'description');
    expect(paramNameElement.textContent).toEqual('clickFn');
    expect(paramTypeElement.textContent).toEqual('Function');
    expect(paramDescriptionElement.textContent).toEqual('Function to be called on button click.');
  });

  it('should not show param required symbol by default', () => {
    const element = compile({ methods: mockMethods() });
    const requiredSymbolElement = getParamRequiredSymbolElement(element);
    expect(requiredSymbolElement).toBeFalsy();
  });

  it('should optionally show param required symbol', () => {
    const methods = mockMethods();
    methods[0].params[0].required = true;
    const element = compile({ methods });
    const requiredSymbolElement = getParamRequiredSymbolElement(element);
    expect(requiredSymbolElement).toBeTruthy();
  });

  it('should not show deprecated method tag by default', () => {
    const element = compile({ methods: mockMethods() });
    const tagElement = getDeprecatedTagElement(element, 'method');
    expect(tagElement).toBeFalsy();
  });

  it('should optionally show deprecated method tag', () => {
    const methods = mockMethods();
    methods[0].deprecated = true;
    const element = compile({ methods });
    const tagElement = getDeprecatedTagElement(element, 'method');
    expect(tagElement).toBeTruthy();
  });

  it('should not show deprecated param tag by default', () => {
    const element = compile({ methods: mockMethods() });
    const tagElement = getDeprecatedTagElement(element, 'param');
    expect(tagElement).toBeFalsy();
  });

  it('should optionally show deprecated method tag', () => {
    const methods = mockMethods();
    methods[0].params[0].deprecated = true;
    const element = compile({ methods });
    const tagElement = getDeprecatedTagElement(element, 'param');
    expect(tagElement).toBeTruthy();
  });
});
