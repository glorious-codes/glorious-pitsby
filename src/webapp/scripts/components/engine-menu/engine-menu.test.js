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
      compile = bindings => {
        const $componentController = $injector.get('$componentController');
        return $componentController('pEngineMenu', {}, bindings);
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

  it('should set items width on get projects success', () => {
    const projectsMock = mockProjects();
    const controller = compile();
    stubGetProjects('success', projectsMock);
    controller.$onInit();
    expect(controller.itemsWidth).toEqual('50.000%');
  });

  it('should show engine menu if more than one project is found', () => {
    const controller = compile();
    stubGetProjects('success', mockProjects());
    controller.$onInit();
    expect(controller.shouldShowMenu).toEqual(true);
  });

  it('should not show engine menu if only one project is found', () => {
    const controller = compile();
    stubGetProjects('success', [{engine: 'angular'}]);
    controller.$onInit();
    expect(controller.shouldShowMenu).toEqual(false);
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
