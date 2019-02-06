const webappDataService = require('./webapp-data');
const externalProjectsDataGenerator = require('./external-projects-data-generator');

describe('External Projects Data Generator', () => {
  beforeEach(() => {
    webappDataService.save = jest.fn();
  });

  it('should save data containing projects engines', () => {
    externalProjectsDataGenerator.init([
      {engine: 'angular', moduleName: 'ng-components'},
      {engine: 'vue', importFrom: './dist/vue-components'}
    ]);
    expect(webappDataService.save).toHaveBeenCalledWith(
      'projects',
      [ {engine: 'angular'}, {engine: 'vue'} ]
    );
  });

  it('should save empty array data if no projects have been given', () => {
    externalProjectsDataGenerator.init();
    expect(webappDataService.save).toHaveBeenCalledWith(
      'projects',
      []
    );
  });
});
