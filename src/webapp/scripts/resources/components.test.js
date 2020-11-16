import { PromiseMock } from '@mocks/promise';
import componentsMock from '@mocks/components';
import dataResource from './data';
import componentsResource from './components';

describe('Components Resource', () => {
  beforeEach(() => {
    mockDataResource(componentsMock);
    // dataResource.get = jest.fn(uri => {
    //   const engine = uri.split('-')[1];
    //   return new PromiseMock('success', componentsMock.data[engine]);
    // });
  });

  function mockDataResource({ data }){
    dataResource.get = jest.fn(uri => {
      const engine = uri.split('-')[1];
      return new PromiseMock('success', data[engine]);
    });
  }

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

  it('should return components sorted by ascending name', () => {
    const responseMock = {
      data: {
        vue: [{ name: 'Button' }, { name: 'Row' }, { name: 'Dialog' }, { name: 'Toaster' }]
      }
    };
    mockDataResource(responseMock);
    const components = componentsResource.get('vue');
    expect(components[0].name).toEqual('Button');
    expect(components[1].name).toEqual('Dialog');
    expect(components[2].name).toEqual('Row');
    expect(components[3].name).toEqual('Toaster');
  });
});
