describe('Main', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-main>${content}</p-main>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('main').attr('class').trim()).toEqual('p-main');
  });

  it('should contain an engine menu', () => {
    const element = compile();
    expect(element.find('p-engine-menu')).toBeDefined();
  });

  it('should transclude some content', () => {
    const element = compile('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });

  it('should set additional top margin to main content if engine menu has more than one engine', () => {
    const engines = [{engine: 'angular'}, {engine: 'vue'}];
    const element = compile();
    element.isolateScope().$ctrl.onEngineMenuLoadComplete(engines);
    element.isolateScope().$digest();
    expect(element.find('main').hasClass('p-main-top-offset')).toEqual(true);
  });

  it('should not set additional top margin to main content if engine menu has only one engine', () => {
    const engines = [{engine: 'angular'}];
    const element = compile();
    element.isolateScope().$ctrl.onEngineMenuLoadComplete(engines);
    element.isolateScope().$digest();
    expect(element.find('main').hasClass('p-main-top-offset')).toEqual(false);
  });
});
