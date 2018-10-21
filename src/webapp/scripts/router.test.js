import stateProviderMock from '@mocks/state-provider';
import urlRouterProviderMock from '@mocks/url-router-provider';
import routesMock from '@mocks/routes';
import routeService from '@scripts/services/route';
import router from '@scripts/router';

describe('Router', () => {
  beforeEach(() => {
    routeService.getAllRoutes = jest.fn(() => routesMock);
  });

  it('should register all routes', () => {
    router(stateProviderMock, urlRouterProviderMock);
    expect(stateProviderMock.state.mock.calls.length).toEqual(2);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routesMock[0]);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routesMock[1]);
  });

  it('should redirect any unknown route to home', () => {
    router(stateProviderMock, urlRouterProviderMock);
    expect(urlRouterProviderMock.otherwise).toHaveBeenCalledWith('/');
  });
});
