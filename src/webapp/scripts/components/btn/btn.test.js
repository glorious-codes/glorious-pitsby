describe('Btn', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}, content = '') => {
        const template = `<p-btn
                            data-theme="{{ theme }}"
                            data-size="{{ size }}"
                            data-on-click="onClick">
                            ${content}
                          </p-btn>`;
        scope.theme = bindings.theme;
        scope.size = bindings.size;
        scope.onClick = bindings.onClick;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should render a default button', () => {
    const element = compile();
    expect(element.find('button').attr('class').trim()).toEqual('p-btn');
  });

  it('should render a small button', () => {
    const element = compile({size: 'small'});
    expect(element.find('button').hasClass('p-btn-small')).toEqual(true);
  });

  it('should render a danger button', () => {
    const element = compile({theme: 'danger'});
    expect(element.find('button').hasClass('p-btn-danger')).toEqual(true);
  });

  it('should transclude some content', () => {
    const element = compile({}, '<span>Item Content</span>');
    expect(element.find('span').text()).toEqual('Item Content');
  });

  it('should call click callback if it has been passed', () => {
    const onClick = jest.fn();
    const element = compile({onClick});
    element.find('button').triggerHandler('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('should not call click callback if it has not been passed', () => {
    const onClick = jest.fn();
    const element = compile();
    element.find('button').triggerHandler('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
