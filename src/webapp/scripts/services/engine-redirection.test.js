import testingService from '@scripts/services/testing';
import { PromiseMock } from '@mocks/promise';
import projectsResource from '@scripts/resources/projects';

describe('Engine Redirection Service', () => {
  let service, routeService;

  function stubGetRouteParams(params = {}){
    routeService.getParams = jest.fn((param) => params[param]);
  }

  function mockGlobalData(){
    return { projects: [{engine: 'angular'}, {engine: 'vue'}] };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      service = $injector.get('engineRedirectionService');
      routeService = $injector.get('routeService');
    });
    routeService.go = jest.fn();
    stubGetRouteParams();
    testingService.mockExternalGlobalData(mockGlobalData());
  });

  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should redirect to the appropriate components on get projects success', done => {
    service.init();
    setTimeout(() => {
      expect(routeService.go).toHaveBeenCalledWith('app.external-components', {
        engine: 'angular'
      });
      done();
    });
  });

  it('should not redirect to the appropriate components on get projects success if it was already redirected', done => {
    stubGetRouteParams({engine: 'angular'});
    service.init();
    setTimeout(() => {
      expect(routeService.go).not.toHaveBeenCalled();
      done();
    });
  });

  it('should log error on get projects error', done => {
    const err = 'Projects have not been found';
    projectsResource.get = jest.fn(() => new PromiseMock('error', err));
    console.log = jest.fn();
    service.init();
    setTimeout(() => {
      expect(console.log).toHaveBeenCalledWith(`Failed to redirect to the appropriate engine: ${err}`);
      done();
    });
  });
});
