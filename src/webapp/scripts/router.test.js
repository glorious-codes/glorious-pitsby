import stateProviderMock from '@mocks/state-provider';
import urlRouterProviderMock from '@mocks/url-router-provider';
import routes from '@scripts/constants/routes';
import router from '@scripts/router';

describe('Router', () => {
  it('should register all routes', () => {
    router(stateProviderMock, urlRouterProviderMock);
    expect(stateProviderMock.state.mock.calls.length).toEqual(3);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[0]);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[1]);
    expect(stateProviderMock.state).toHaveBeenCalledWith(routes[2]);
  });

  it('should redirect any unknown route to home', () => {
    router(stateProviderMock, urlRouterProviderMock);
    expect(urlRouterProviderMock.otherwise).toHaveBeenCalledWith('/');
  });
});
