import pubsubService from '@scripts/services/pubsub';

describe('Menu Trigger', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-menu-trigger></p-menu-trigger>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    pubsubService.publish = jest.fn();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-menu-trigger');
  });

  it('should publish appropriate event on menu click', () => {
    const element = compile();
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(pubsubService.publish).toHaveBeenCalledWith('menuTriggerClicked');
  });
});
