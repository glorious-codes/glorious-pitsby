describe('Tabs', () => {
  let compile;

  function mockTabsContent(){
    return `
      <p-tab data-name="First">First</p-tab>
      <p-tab data-name="Second">Second</p-tab>
    `;
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $timeout) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-tabs>${content}</p-tabs>`;
        const element = $compile(template)(scope);
        scope.$digest();
        $timeout.flush();
        return element;
      };
    });
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

  it('should select first tab on initialize', () => {
    const element = compile(mockTabsContent());
    const tabs = element[0].querySelectorAll('p-tab');
    expect(tabs[0].classList.contains('p-tab-active')).toEqual(true);
    expect(tabs[1].classList.contains('p-tab-active')).toEqual(false);
  });
});
