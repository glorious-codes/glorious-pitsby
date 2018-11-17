import angular from 'angular';
import { angularModuleMock } from '@mocks/angular';
import router from '@scripts/router';
import appIndexTemplate from '@scripts/index-template';

describe('App Index Template', () => {
  beforeEach(() => {
    angular.module = jest.fn(() => angularModuleMock);
  });

  it('should instantiate application module', () => {
    appIndexTemplate.init();
    expect(angular.module).toHaveBeenCalledWith('pitsby-app', [
      'ui.router',
      'pitsby-components',
      'pitsby-services'
    ]);
  });

  it('should configure application router', () => {
    appIndexTemplate.init();
    expect(angularModuleMock.config).toHaveBeenCalledWith(router);
  });
});
