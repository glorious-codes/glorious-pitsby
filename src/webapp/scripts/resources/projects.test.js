import testingService from '@scripts/services/testing';
import projectsResource from './projects';

describe('Projects Resource', () => {
  afterEach(() => {
    testingService.clearExternalGlobalData();
  });

  it('should get projects', done => {
    const projects = [{ engine: 'vue' }];
    testingService.mockExternalGlobalData({ projects });
    projectsResource.get().then(response => {
      expect(response).toEqual(projects);
      done();
    });
  });

  it('should reject a promise if projects have not been found', done => {
    projectsResource.get().then(() => {}, err => {
      expect(err).toEqual('Projects have not been found');
      done();
    });
  });
});
