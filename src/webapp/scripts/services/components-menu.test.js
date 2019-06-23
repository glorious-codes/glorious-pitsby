import componentsResource from '@scripts/resources/components';
import componentsMenuService from './components-menu';

describe('Menu Service', () => {
  function mockComponents(){
    return [
      {id: 'button', name: 'Button'},
      {id: 'card', name: 'Card'}
    ];
  }

  beforeEach(() => {
    componentsResource.get = jest.fn(() => Promise.resolve(mockComponents()));
  });

  it('should contain a parent item called Components', done => {
    componentsMenuService.build('vue').then(menu => {
      expect(menu[0].id).toEqual('components');
      expect(menu[0].name).toEqual('Components');
      done();
    });
  });

  it('should Components parent items contain one child menu item for each external component', done => {
    componentsMenuService.build('vue').then(menu => {
      expect(menu[0].children).toEqual([
        {
          id: 'button',
          name: 'Button',
          route: {
            name: 'app.external-components.component',
            params: {
              engine: 'vue',
              componentId: 'button'
            }
          }
        },
        {
          id: 'card',
          name: 'Card',
          route: {
            name: 'app.external-components.component',
            params: {
              engine: 'vue',
              componentId: 'card'
            }
          }
        },
      ]);
      done();
    });
  });
});
