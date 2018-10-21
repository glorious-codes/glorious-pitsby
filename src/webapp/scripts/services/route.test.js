import routesConstant from '@scripts/constants/routes';
import routeService from './route';

describe('Route Service', () => {
  it('should get all routes', () => {
    expect(routeService.getAllRoutes()).toEqual(routesConstant);
  });
});
