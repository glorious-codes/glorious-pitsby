describe('Viewport', () => {
  let compile, engineRedirectionService;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($injector, $rootScope, $compile) => {
      engineRedirectionService = $injector.get('engineRedirectionService');
      compile = (content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-viewport>${content}</p-viewport>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    engineRedirectionService.init = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-viewport');
  });

  it('should initialize engine redirection service on initialize', () => {
    compile();
    expect(engineRedirectionService.init).toHaveBeenCalled();
  });

  it('should transclude some content', () => {
    const element = compile('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
