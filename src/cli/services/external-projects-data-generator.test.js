const webappDataService = require('./webapp-data');
const externalProjectsDataGenerator = require('./external-projects-data-generator');

describe('External Projects Data Generator', () => {
  beforeEach(() => {
    webappDataService.save = jest.fn();
  });

  it('should return a promise on save', () => {
    const promise = externalProjectsDataGenerator.init();
    expect(promise.then).toBeDefined();
  });

  it('should save data containing projects engines', () => {
    externalProjectsDataGenerator.init([
      {engine: 'angular', moduleName: 'ng-components'},
      {engine: 'vue', importFrom: './dist/vue-components'}
    ]);
    expect(webappDataService.save.mock.calls[0][0]).toEqual('projects.json');
    expect(webappDataService.save.mock.calls[0][1]).toEqual([ {engine: 'angular'}, {engine: 'vue'} ]);
    expect(typeof webappDataService.save.mock.calls[0][2]).toEqual('function');
    expect(typeof webappDataService.save.mock.calls[0][3]).toEqual('function');
  });

  it('should save empty array data if no projects have been given', () => {
    externalProjectsDataGenerator.init();
    expect(webappDataService.save.mock.calls[0][1]).toEqual([]);
  });
});
