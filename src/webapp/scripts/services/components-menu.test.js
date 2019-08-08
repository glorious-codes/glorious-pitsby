import componentsResource from '@scripts/resources/components';
import componentsMenuService from './components-menu';

describe('Components Menu Service', () => {
  function mockComponents(){
    return [
      {id: 'button', name: 'Button'},
      {id: 'card', name: 'Card'}
    ];
  }

  function mockItems(){
    return [
      {
        name: 'Components', children: [
          {name: 'Card'}, {name: 'Page'}, {name: 'Box'}
        ]
      },
      {
        name: 'Playground'
      }
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

  it('should contain a parent item called Playground', done => {
    componentsMenuService.build('vue').then(menu => {
      expect(menu[1].id).toEqual('playground');
      expect(menu[1].name).toEqual('Playground');
      expect(menu[1].route).toEqual({
        name: 'app.external-components.playground',
        params: { engine: 'vue' }
      });
      done();
    });
  });

  it('should filter items', () => {
    expect(componentsMenuService.filter(mockItems(), 'p')).toEqual([
      {
        name: 'Components', children: [
          {name: 'Page'}
        ]
      },
      {
        name: 'Playground'
      }
    ]);
  });

  it('should remove parent items when none of its children matches searched term', () => {
    expect(componentsMenuService.filter(mockItems(), 'pl')).toEqual([
      {
        name: 'Playground'
      }
    ]);
  });
});
