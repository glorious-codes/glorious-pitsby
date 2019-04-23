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

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      service = $injector.get('engineRedirectionService');
      routeService = $injector.get('routeService');
    });
    routeService.go = jest.fn();
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

  it('should log error on get projects error', () => {
    const err = {some: 'err'};
    stubGetProject('error', err);
    console.log = jest.fn();
    service.init();
    expect(console.log).toHaveBeenCalledWith('Failed to redirect to the appropriate engine', err);
  });
});
