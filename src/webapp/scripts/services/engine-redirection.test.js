import { PromiseMock } from '@mocks/promise';
import projectsResource from '@scripts/resources/projects';

describe('Engine Redirection Service', () => {
  let service, routeService;

  function mockProjects(){
    return [{engine: 'angular'}];
  }

  function stubGetProject(responseType, response){
    projectsResource.get = jest.fn(() => new PromiseMock(responseType, response));
  }

  function stubGetRouteParams(params = {}){
    routeService.getParams = jest.fn((param) => params[param]);
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      service = $injector.get('engineRedirectionService');
      routeService = $injector.get('routeService');
    });
    routeService.go = jest.fn();
    stubGetRouteParams();
    stubGetProject('success', mockProjects());
  });

  it('should get projects on initialize', () => {
    service.init();
    expect(projectsResource.get).toHaveBeenCalled();
  });

  it('should redirect to the appropriate components on get projects success', () => {
    service.init();
    expect(routeService.go).toHaveBeenCalledWith('app.external-components', {
      engine: 'angular'
    });
  });

  it('should not redirect to the appropriate components on get projects success if it was already redirected', () => {
    stubGetRouteParams({engine: 'angular'});
    service.init();
    expect(routeService.go).not.toHaveBeenCalled();
  });

  it('should log error on get projects error', () => {
    const err = {some: 'err'};
    stubGetProject('error', err);
    console.log = jest.fn();
    service.init();
    expect(console.log).toHaveBeenCalledWith('Failed to redirect to the appropriate engine', err);
  });
});
