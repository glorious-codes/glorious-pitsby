import { PromiseMock } from '@mocks/promise';
import projectsResource from '@scripts/resources/projects';

describe('Engine Menu', () => {
  let compile;

  function mockProjects(){
    return [{engine: 'angular'}, {engine: 'vue'}];
  }

  function stubGetProjects(responseType, response){
    projectsResource.get = jest.fn(() => {
      return new PromiseMock(responseType, response);
    });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      compile = () => {
        const $componentController = $injector.get('$componentController');
        return $componentController('pEngineMenu');
      };
    });
  });

  it('should fetch projects on initialize', () => {
    const controller = compile();
    stubGetProjects('success', mockProjects());
    controller.$onInit();
    expect(projectsResource.get).toHaveBeenCalled();
  });

  it('should set projects on get projects success', () => {
    const projectsMock = mockProjects();
    const controller = compile();
    stubGetProjects('success', projectsMock);
    controller.$onInit();
    expect(controller.projects).toEqual(projectsMock);
  });

  it('should log error on get projects error', () => {
    const errorMock = {some: 'error'};
    const controller = compile();
    console.log = jest.fn();
    stubGetProjects('error', errorMock);
    controller.$onInit();
    expect(console.log).toHaveBeenCalledWith('Failed to get projects', errorMock);
  });
});
