import angular from 'angular';
import { angularModuleMock } from '@mocks/angular';
import router from '@scripts/router';
import appIndex from '@scripts/index';

describe('App Index', () => {
  beforeEach(() => {
    angular.module = jest.fn(() => angularModuleMock);
  });

  it('should instantiate application module', () => {
    appIndex.init();
    expect(angular.module).toHaveBeenCalledWith('app', [
      'ui.router',
      'components'
    ]);
  });

  it('should configure application router', () => {
    appIndex.init();
    expect(angularModuleMock.config).toHaveBeenCalledWith(router);
  });
});
