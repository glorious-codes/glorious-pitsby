import stateProviderMock from '@mocks/state-provider';
import transitionsProviderMock from '@mocks/transitions-provider';
import urlRouterProviderMock from '@mocks/url-router-provider';
import analyticsService from '@scripts/services/analytics';
import routes from '@scripts/constants/routes';
import router from '@scripts/router';

describe('Router', () => {
  it('should register all routes', () => {
    router(stateProviderMock, urlRouterProviderMock, transitionsProviderMock);
    expect(stateProviderMock.state.mock.calls.length).toEqual(3);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[0]);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[1]);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[2]);
  });

  it('should redirect any unknown route to home', () => {
    router(stateProviderMock, urlRouterProviderMock, transitionsProviderMock);
    expect(urlRouterProviderMock.otherwise).toHaveBeenCalledWith('/');
  });

  it('should track page view on every route success change', () => {
    router(stateProviderMock, urlRouterProviderMock, transitionsProviderMock);
    expect(transitionsProviderMock.onSuccess).toHaveBeenCalledWith({}, analyticsService.trackPageView);
  });
});
