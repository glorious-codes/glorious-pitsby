describe('Menu Item', () => {
  let compile, routeService;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $injector) => {
      routeService = $injector.get('routeService');
      compile = (bindings = {}, content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-components-menu-item data-item="$ctrl.item">
                            ${content}
                          </p-components-menu-item>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    routeService.go = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile({item: {}});
    expect(element.find('div').hasClass('p-components-menu-item-container')).toEqual(true);
  });

  it('should render item name', () => {
    const name = 'Button';
    const element = compile({ item: { name } });
    const nameElement = element[0].querySelector('[data-menu-item-name]');
    expect(nameElement.textContent.trim()).toEqual(name);
  });

  it('should transclude some content', () => {
    const element = compile({item: {}}, '<p>Hello!</p>');
    expect(element.find('p').text().trim()).toEqual('Hello!');
  });

  it('should set appropriate css class if item has children', () => {
    const element = compile({ item: { children: [{ name: 'button' }] } });
    expect(element.find('div').hasClass('p-components-menu-item-has-children')).toEqual(true);
  });

  it('should show item children on initialization', () => {
    const element = compile({ item: { children: [{ name: 'button' }] } });
    expect(element.find('div').hasClass('p-components-menu-item-children-visible')).toEqual(true);
  });

  it('should go to the item route on item click', () => {
    const name = 'inbox';
    const params = { email: 'some@email.com' };
    const element = compile({ item: { route: { name, params } } });
    const nameElement = element[0].querySelector('[data-menu-item-name]');
    nameElement.click();
    expect(routeService.go).toHaveBeenCalledWith(name, params, { resetUrlPath: true });
  });

  it('should hide item children on item click if children are already visible', () => {
    const element = compile({ item: { name: 'Components' } });
    const nameElement = element[0].querySelector('[data-menu-item-name]');
    nameElement.click();
    nameElement.click();
    expect(element.find('div').hasClass('p-components-menu-item-children-visible')).toEqual(false);
  });
});
