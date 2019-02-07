import dataResource from './data';
import projectsResource from './projects';

describe('Projects Resource', () => {

  beforeEach(() => {
    dataResource.get = jest.fn();
  });

  it('should be able to get projects', () => {
    projectsResource.get();
    expect(dataResource.get).toHaveBeenCalledWith('/projects');
  });
});
