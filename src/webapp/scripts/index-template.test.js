import angular from 'angular';
import { angularModuleMock } from '@mocks/angular';
import router from '@scripts/router';
import analyticsService from '@scripts/services/analytics';
import appIndexTemplate from '@scripts/index-template';

describe('App Index Template', () => {
  beforeEach(() => {
    angular.module = jest.fn(() => angularModuleMock);
    analyticsService.init = jest.fn();
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

  it('should configure application router', () => {
    appIndexTemplate.init();
    expect(analyticsService.init).toHaveBeenCalled();
  });
});
