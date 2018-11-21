describe('Tabs', () => {
  let compile, tabsRouteParamsService;

  function mockTabsContent(){
    return `
      <p-tab data-name="First">First</p-tab>
      <p-tab data-name="Second">Second</p-tab>
    `;
  }

  function stubGetRouteParams(paramValue){
    tabsRouteParamsService.get = jest.fn(() => paramValue);
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $timeout, $injector) => {
      tabsRouteParamsService = $injector.get('tabsRouteParamsService');
      compile = (content = '', bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-tabs
                            data-query-param-key="{{ queryParamKey }}">
                            ${content}
                          </p-tabs>`;
        scope.queryParamKey = bindings.queryParamKey;
        const element = $compile(template)(scope);
        scope.$digest();
        $timeout.flush();
        return element;
      };
    });
    tabsRouteParamsService.set = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile(mockTabsContent());
    expect(element.find('div').attr('class')).toEqual('p-tabs');
  });

  it('should transclude some content', () => {
    const element = compile('<p-tab name="hello"><p>Hello</p></p-tab>');
    expect(element.find('p').text()).toEqual('Hello');
  });

  it('should build tabs based on transcluded content', () => {
    const element = compile(mockTabsContent());
    const controller = element.find('div').scope().$ctrl;
    expect(controller.tabs[0].name).toEqual('First');
    expect(controller.tabs[0].isActive).toEqual(true);
    expect(controller.tabs[1].name).toEqual('Second');
  });

  it('should not look for tab index query param on initialize if no query param key has been given', () => {
    stubGetRouteParams();
    compile(mockTabsContent());
    expect(tabsRouteParamsService.get).not.toHaveBeenCalled();
  });

  it('should select first tab on initialize if no tab index query param is found', () => {
    const element = compile(mockTabsContent());
    const tabs = element[0].querySelectorAll('p-tab');
    expect(tabs[0].classList.contains('p-tab-active')).toEqual(true);
    expect(tabs[1].classList.contains('p-tab-active')).toEqual(false);
  });

  it('should look for tab index query param on initialize if query param key has been given', () => {
    stubGetRouteParams();
    const queryParamKey = 'customKey';
    compile(mockTabsContent(), {queryParamKey});
    expect(tabsRouteParamsService.get).toHaveBeenCalledWith(queryParamKey);
  });

  it('should select custom tab on initialize if tab index query param is found', () => {
    stubGetRouteParams('1');
    const element = compile(mockTabsContent(), {queryParamKey: 'customKey'});
    const controller = element.find('div').scope().$ctrl;
    expect(controller.tabs[1].isActive).toEqual(true);
  });

  it('should select a specific tab', () => {
    const element = compile(mockTabsContent());
    const controller = element.find('div').scope().$ctrl;
    controller.selectTab(controller.tabs[1]);
    expect(controller.tabs[1].isActive).toEqual(true);
  });

  it('should keep selected tab index on url if query param key has been given', () => {
    const queryParamKey = 'customKey';
    const element = compile(mockTabsContent(), {queryParamKey});
    const controller = element.find('div').scope().$ctrl;
    controller.selectTab(controller.tabs[1], 1);
    expect(tabsRouteParamsService.set).toHaveBeenCalledWith({customKey: 1});
  });

  it('should not keep selected tab index on url if no query param key has been given', () => {
    const element = compile(mockTabsContent());
    const controller = element.find('div').scope().$ctrl;
    controller.selectTab(controller.tabs[1], 1);
    expect(tabsRouteParamsService.set).not.toHaveBeenCalled();
  });
});
