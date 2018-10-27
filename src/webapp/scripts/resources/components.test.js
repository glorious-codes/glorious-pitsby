import { PromiseMock } from '@mocks/promise';
import componentsMock from '@mocks/components';
import dataResource from './data';
import componentsResource from './components';

describe('Components Resource', () => {
  beforeEach(() => {
    const promise = new PromiseMock('success', componentsMock.data);
    dataResource.get = jest.fn(() => promise);
  });

  it('should be able to get components', () => {
    const components = componentsResource.get();
    expect(dataResource.get).toHaveBeenCalledWith('/components');
    expect(components).toEqual(componentsMock.data);
  });

  it('should be able to get a single component', () => {
    expect(componentsResource.get('button')).toEqual(componentsMock.data[0]);
  });
});
