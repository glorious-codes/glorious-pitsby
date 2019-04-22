import { PromiseMock } from '@mocks/promise';
import dataResource from './data';
import projectsResource from './projects';

describe('Projects Resource', () => {

  function stubGetData(responseType, response){
    dataResource.get = jest.fn(() => {
      return new PromiseMock(responseType, response);
    });
  }

  beforeEach(() => {
    stubGetData('success');
  });

  it('should get projects', () => {
    projectsResource.get();
    expect(dataResource.get).toHaveBeenCalledWith('/projects');
  });

  it('should not get projects if projects has already been obtained', () => {
    stubGetData('success', [{engine: 'angular'}]);
    projectsResource.get();
    projectsResource.get();
    expect(dataResource.get.mock.calls.length).toEqual(1);
  });
});
