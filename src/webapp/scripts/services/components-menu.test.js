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
          {name: 'Box'}, {name: 'Card'}, {name: 'Page'}
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
          isVisible: true,
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
          isVisible: true,
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

  it('should config items visibility by term', () => {
    expect(componentsMenuService.configItemsVisibilityByTerm(mockItems(), 'pa')).toEqual([
      {
        name: 'Components', children: [
          {name: 'Box', isVisible: false},
          {name: 'Card', isVisible: false},
          {name: 'Page', isVisible: true}
        ]
      },
      {
        name: 'Playground',
        isVisible: false
      }
    ]);
  });

  it('should visibility configuration be case insensitive', () => {
    expect(componentsMenuService.configItemsVisibilityByTerm(mockItems(), 'BO')).toEqual([
      {
        name: 'Components', children: [
          {name: 'Box', isVisible: true},
          {name: 'Card', isVisible: false},
          {name: 'Page', isVisible: false}
        ]
      },
      {
        name: 'Playground',
        isVisible: false
      }
    ]);
  });

  it('should set all items as visible if no term has been given', () => {
    expect(componentsMenuService.configItemsVisibilityByTerm(mockItems())).toEqual([
      {
        name: 'Components', children: [
          {name: 'Box', isVisible: true},
          {name: 'Card', isVisible: true},
          {name: 'Page', isVisible: true}
        ]
      },
      {
        name: 'Playground',
        isVisible: true
      }
    ]);
  });

  it('should remove parent items when none of its children matches searched term', () => {
    expect(componentsMenuService.configItemsVisibilityByTerm(mockItems(), 'pl')).toEqual([
      {
        name: 'Components', children: [
          {name: 'Box', isVisible: false},
          {name: 'Card', isVisible: false},
          {name: 'Page', isVisible: false}
        ]
      },
      {
        name: 'Playground',
        isVisible: true
      }
    ]);
  });

  it('should get visible items', () => {
    const items = componentsMenuService.configItemsVisibilityByTerm(mockItems(), 'p');
    expect(componentsMenuService.getVisibleItems(items)).toEqual([
      { name: 'Page', isVisible: true },
      { name: 'Playground', isVisible: true }
    ]);
  });

  it('should hide parent items when no child is visible', () => {
    const items = componentsMenuService.configItemsVisibilityByTerm(mockItems(), 'play');
    expect(componentsMenuService.getVisibleItems(items)).toEqual([
      { name: 'Playground', isVisible: true }
    ]);
  });
});
