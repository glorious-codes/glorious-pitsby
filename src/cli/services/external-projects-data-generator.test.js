const webappDataService = require('./webapp-data');
const externalProjectsDataGenerator = require('./external-projects-data-generator');

describe('External Projects Data Generator', () => {
  beforeEach(() => {
    webappDataService.save = jest.fn((filename, data, onSuccess) => onSuccess());
  });

  it('should save data containing projects engines', done => {
    externalProjectsDataGenerator.init([
      { engine: 'angular', moduleName: 'ng-components' },
      { engine: 'vue', importFrom: './dist/vue-components' }
    ]).then(() => {
      expect(webappDataService.save).toHaveBeenCalledWith(
        'projects.json',
        [{ engine: 'angular' }, { engine: 'vue' }],
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should save empty array data if no projects have been given', done => {
    externalProjectsDataGenerator.init().then(() => {
      expect(webappDataService.save.mock.calls[0][1]).toEqual([]);
      done();
    });
  });
});
