import routePathService from './route-path';

describe('Route Path Service', () => {
  function mockRoutes(){
    return [
      {name: 'grand', url: '/grand'},
      {name: 'grand.parent', url: '/parent'},
      {name: 'grand.parent.child', url: '/child/:id?query'}
    ];
  }

  it('should build route path', () => {
    const path = routePathService.build(
      mockRoutes(),
      'grand.parent.child',
      { id: 123 }
    );
    expect(path).toEqual('/grand/parent/child/123');
  });

  it('should built route path not contain query params', () => {
    const path = routePathService.build(
      mockRoutes(),
      'grand.parent.child',
      { id: 123 }
    );
    expect(path.includes('?query')).toEqual(false);
  });
});
