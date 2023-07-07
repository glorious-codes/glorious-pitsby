import testingService from '@scripts/services/testing';
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
    testingService.mockExternalGlobalData({ projects: [{ engine: 'vue' }] });
  });

  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').hasClass('p-sidebar')).toEqual(true);
  });

  it('should contain a logo', () => {
    const element = compile();
    expect(element.find('p-logo').length).toEqual(1);
  });

  it('should contain a color scheme toggler', () => {
    const element = compile();
    expect(element.find('p-color-scheme-toggler').length).toEqual(1);
  });

  it('should contain a components menu', () => {
    const element = compile();
    expect(element.find('p-components-menu').length).toEqual(1);
  });

  it('should be able to hide sidebar', () => {
    const element = compile();
    getController(element).hideSidebar();
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
  });

  it('should hide sidebar on components menu item click if item has no children', () => {
    const element = compile();
    pubsubService.publish('menuTriggerClicked');
    element.isolateScope().$digest();
    getController(element).onComponentsMenuItemClick({});
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
    getController(element).$onDestroy();
  });

  it('should not hide sidebar on components menu item click if item has children', () => {
    const element = compile();
    pubsubService.publish('menuTriggerClicked');
    element.isolateScope().$digest();
    getController(element).onComponentsMenuItemClick({children: [{}]});
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(true);
    getController(element).$onDestroy();
  });

  it('should show sidebar on menu trigger click', () => {
    const element = compile();
    pubsubService.publish('menuTriggerClicked');
    element.isolateScope().$digest();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(true);
    getController(element).$onDestroy();
  });

  it('should unsubscribe from menu trigger click on destroy', () => {
    pubsubService.unsubscribe = jest.fn();
    pubsubService.subscribe = jest.fn(() => '123');
    const element = compile();
    getController(element).$onDestroy();
    expect(pubsubService.unsubscribe).toHaveBeenCalledWith('123');
  });
});
