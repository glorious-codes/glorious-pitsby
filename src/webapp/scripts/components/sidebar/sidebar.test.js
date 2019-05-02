import pubsubService from '@scripts/services/pubsub';

describe('Sidebar', () => {
  let compile;

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
    pubsubService.subscribe = jest.fn();
    pubsubService.unsubscribe = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-sidebar');
  });

  it('should contain a logo', () => {
    const element = compile();
    expect(element.find('p-logo').length).toEqual(1);
  });

  it('should contain an external componets list', () => {
    const element = compile();
    expect(element.find('p-external-components-list').length).toEqual(1);
  });

  it('should subscribe on menu trigger click topic on initialize', () => {
    compile();
    expect(pubsubService.subscribe.mock.calls[0][0]).toEqual('menuTriggerClicked');
    expect(typeof pubsubService.subscribe.mock.calls[0][1]).toEqual('function');
  });

  it('should be able to hide sidebar', () => {
    const element = compile();
    element.isolateScope().$ctrl.hideSidebar();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
  });

  it('should hide sidebar on external components list item click', () => {
    const element = compile();
    element.isolateScope().$ctrl.onExternalComponentsListItemClick();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(false);
  });

  it('should show sidebar on menu trigger click', () => {
    pubsubService.subscribe = jest.fn((topic, callback) => callback());
    const element = compile();
    expect(element.find('div').hasClass('p-sidebar-visible')).toEqual(true);
  });

  it('should unsubscribe from menu trigger click on destroy', () => {
    pubsubService.subscribe = jest.fn(() => '123');
    const element = compile();
    element.isolateScope().$ctrl.$onDestroy();
    expect(pubsubService.unsubscribe).toHaveBeenCalledWith('123');
  });
});
