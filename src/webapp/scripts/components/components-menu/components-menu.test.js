import componentsMenuService from '@scripts/services/components-menu';

describe('Menu', () => {
  let compile;
  let routeService;

  function mockRouteParams(engine, componentId){
    return { engine: 'vue', componentId };
  }

  function mockItems(){
    return [
      {
        id: 'components', name: 'Components', children: [
          {
            id: 'button', name: 'Button', route: {
              name: 'externalComponents',
              params: { engine: 'vue', componentId: 'button' }
            }
          },
          {
            id: 'card', name: 'Card', route: {
              name: 'externalComponents',
              params: { engine: 'vue', componentId: 'card' }
            }
          }
        ]
      },
      {
        id: 'playground', name: 'Playground', route: {}
      }
    ];
  }

  function getMenuController(element){
    return element.isolateScope().$ctrl;
  }

  function stubMenuBuild(){
    componentsMenuService.build = jest.fn(() => Promise.resolve());
  }

  function stubGetRouteParams(componentId){
    routeService.getParams = jest.fn(param => mockRouteParams('vue', componentId)[param]);
  }

  function stubCurrentRoute(name, paramName, paramValue){
    routeService.isCurrentRoute = jest.fn((routeName, routeParams) => {
      return  routeName === routeName &&
              routeParams &&
              routeParams[paramName] === paramValue;
    });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $injector) => {
      routeService = $injector.get('routeService');
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-components-menu />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    stubGetRouteParams();
    stubMenuBuild();
    stubCurrentRoute();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-components-menu');
  });

  it('should build menu items passing external component engine as param on fetch', () => {
    const element = compile();
    getMenuController(element).fetch();
    expect(componentsMenuService.build).toHaveBeenCalledWith('vue');
  });

  it('should set items on fetch success', () => {
    const itemsMock = mockItems();
    const element = compile();
    const menuController = getMenuController(element);
    menuController.fetchSuccess(itemsMock);
    expect(menuController.items).toEqual(itemsMock);
  });

  it('should activate item if its route matches the current route', () => {
    const element = compile();
    const menuController = getMenuController(element);
    stubCurrentRoute('externalComponents', 'componentId', 'card');
    menuController.fetchSuccess(mockItems());
    expect(menuController.items[0].children[1].active).toEqual(true);
  });

  it('should config active item on route change', () => {
    const element = compile();
    const menuController = getMenuController(element);
    stubCurrentRoute('externalComponents', 'componentId', 'button');
    menuController.$transitions.onSuccess = jest.fn((options, cb) => cb());
    menuController.fetchSuccess(mockItems());
    menuController.$onInit();
    expect(menuController.items[0].children[0].active).toEqual(true);
  });
});
