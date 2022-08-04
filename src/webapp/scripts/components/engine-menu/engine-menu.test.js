import testingService from '@scripts/services/testing';

describe('Engine Menu', () => {
  let compile;

  function mockGlobalData(){
    return { projects: [{engine: 'angular'}, {engine: 'vue'}] };
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

  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should set projects on get projects success', done => {
    console.log = jest.fn();
    const data = mockGlobalData();
    const controller = compile();
    testingService.mockExternalGlobalData(data);
    controller.$onInit();
    setTimeout(() => {
      expect(controller.projects).toEqual(data.projects);
      done();
    });
  });

  it('should show engine menu if more than one project is found', done => {
    const controller = compile();
    testingService.mockExternalGlobalData(mockGlobalData());
    controller.$onInit();
    setTimeout(() => {
      expect(controller.shouldShowMenu).toEqual(true);
      done();
    });
  });

  it('should not show engine menu if only one project is found', done => {
    const controller = compile();
    testingService.mockExternalGlobalData({ projects: [{ engine: 'vue' }] });
    controller.$onInit();
    setTimeout(() => {
      expect(controller.shouldShowMenu).toEqual(false);
      done();
    });
  });

  it('should log error on get projects error', done => {
    const controller = compile();
    controller.$onInit();
    setTimeout(() => {
      expect(console.log).toHaveBeenCalledWith('Failed to get projects: Projects have not been found');
      done();
    });
  });
});
