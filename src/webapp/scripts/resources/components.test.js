import { PromiseMock } from '@mocks/promise';
import componentsMock from '@mocks/components';
import dataResource from './data';
import componentsResource from './components';

describe('Components Resource', () => {
  beforeEach(() => {
    dataResource.get = jest.fn(uri => {
      const engine = uri.split('-')[1];
      return new PromiseMock('success', componentsMock.data[engine]);
    });
  });

  it('should be able to get angular components', () => {
    const components = componentsResource.get('angular');
    expect(dataResource.get).toHaveBeenCalledWith('/components-angular');
    expect(components).toEqual(componentsMock.data.angular);
  });

  it('should be able to get an angular single component', () => {
    expect(componentsResource.get('angular', 'button')).toEqual(componentsMock.data.angular[0]);
  });

  it('should be able to get vue components', () => {
    const components = componentsResource.get('vue');
    expect(dataResource.get).toHaveBeenCalledWith('/components-vue');
    expect(components).toEqual(componentsMock.data.vue);
  });

  it('should be able to get a vue single component', () => {
    expect(componentsResource.get('vue', 'badge')).toEqual(componentsMock.data.vue[0]);
  });
});
