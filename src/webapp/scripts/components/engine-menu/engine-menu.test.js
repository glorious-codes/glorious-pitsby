import { PromiseMock } from '@mocks/promise';
import projectsResource from '@scripts/resources/projects';

describe('Engine Menu', () => {
  let compile, routeService;

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
      routeService = $injector.get('routeService');
      compile = bindings => {
        const $componentController = $injector.get('$componentController');
        return $componentController('pEngineMenu', {}, bindings);
      };
    });
    routeService.go = jest.fn();
    routeService.getParams = jest.fn();
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

  it('should execute load complete callback on fetch complete if callback has been provided', () => {
    const onLoadComplete = jest.fn();
    const projectsMock = mockProjects();
    const controller = compile({ onLoadComplete });
    stubGetProjects('success', projectsMock);
    controller.$onInit();
    expect(onLoadComplete).toHaveBeenCalledWith(projectsMock);
  });

  it('should not execute load complete callback on fetch complete if callback has not been provided', () => {
    const onLoadComplete = jest.fn();
    const projectsMock = mockProjects();
    const controller = compile({ onLoadComplete });
    stubGetProjects('success', projectsMock);
    delete controller.onLoadComplete;
    controller.$onInit();
    expect(onLoadComplete).not.toHaveBeenCalledWith(projectsMock);
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

  it('should select first project found on get projects success if no project is already selected', () => {
    const projectsMock = mockProjects();
    const controller = compile();
    stubGetProjects('success', projectsMock);
    controller.$onInit();
    expect(routeService.go).toHaveBeenCalledWith('app.external-components', {
      engine: projectsMock[0].engine
    });
  });

  it('should not select first project found on get projects success if some project is already selected', () => {
    routeService.getParams = jest.fn(param => {
      return param == 'engine' ? 'angular' : null;
    });
    const controller = compile();
    stubGetProjects('success', mockProjects());
    controller.$onInit();
    expect(routeService.go).not.toHaveBeenCalled();
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
