import pubsubService from '@scripts/services/pubsub';

describe('Sidebar', () => {
  let compile;

  function getController(element){
    return element.isolateScope().$ctrl;
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-sidebar />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    pubsubService.subscribe = jest.fn((topic, callback) => callback());
    pubsubService.unsubscribe = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-sidebar')).toEqual(true);
  });

  it('should contain a logo', () => {
    const element = compile();
    expect(element.find('p-logo').length).toEqual(1);
  });

  it('should contain a componests menu', () => {
    const element = compile();
    expect(element.find('p-components-menu').length).toEqual(1);
  });

  it('should subscribe on menu trigger click topic on initialize', () => {
    compile();
    expect(pubsubService.subscribe.mock.calls[0][0]).toEqual('menuTriggerClicked');
    expect(typeof pubsubService.subscribe.mock.calls[0][1]).toEqual('function');
  });

  it('should be able to hide sidebar', () => {
    const element = compile();
    getController(element).hideSidebar();
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
  });

  it('should hide sidebar on components menu item click if item has no children', () => {
    const element = compile();
    getController(element).onComponentsMenuItemClick({});
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
  });

  it('should not hide sidebar on components menu item click if item has children', () => {
    const element = compile();
    getController(element).onComponentsMenuItemClick({children: [{}]});
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(true);
  });

  it('should show sidebar on menu trigger click', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(true);
  });

  it('should unsubscribe from menu trigger click on destroy', () => {
    pubsubService.subscribe = jest.fn(() => '123');
    const element = compile();
    getController(element).$onDestroy();
    expect(pubsubService.unsubscribe).toHaveBeenCalledWith('123');
  });
});
