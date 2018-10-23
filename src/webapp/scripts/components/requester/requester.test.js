import { PromiseMock } from '@mocks/promise';

describe('Requester', () => {
  let compile, compileElement;

  function mockFetchBindings(responseType, options = {}){
    const fetch = jest.fn(() => {
      return new PromiseMock(
        responseType,
        options.response,
        options.shouldAbortRequest
      );
    });
    return {
      fetch,
      fetchSuccess: jest.fn()
    };
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $componentController) => {
      compile = bindings => {
        return $componentController('pRequester', {}, bindings);
      };
      compileElement = (content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-requester>${content}</p-requester>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should show content if no fetch has been passed', () => {
    const component = compile();
    component.$onInit();
    expect(component.shouldShowContent).toEqual(true);
  });

  it('should optionally hide content on request', () => {
    const bindings = mockFetchBindings('success', {
      shouldAbortRequest: true
    });
    bindings.shouldHideContentOnRequest = true;
    const component = compile(bindings);
    component.$onInit();
    expect(component.shouldShowContent).toEqual(false);
  });

  it('should optionally hide content on request error', () => {
    const bindings = mockFetchBindings('error');
    bindings.shouldHideContentOnRequest = true;
    const component = compile(bindings);
    component.$onInit();
    expect(component.shouldShowContent).toEqual(false);
  });

  it('should fetch data on initialize if fetch action has been passed', () => {
    const bindings = mockFetchBindings('success');
    const component = compile(bindings);
    component.$onInit();
    expect(bindings.fetch).toHaveBeenCalled();
  });

  it('should call fetch success action on fetch data success', () => {
    const response = {some: 'response'};
    const bindings = mockFetchBindings('success', { response });
    const component = compile(bindings);
    component.$onInit();
    expect(bindings.fetchSuccess).toHaveBeenCalledWith(response);
  });

  it('should show loader on request', () => {
    const bindings = mockFetchBindings('success', {
      shouldAbortRequest: true
    });
    const component = compile(bindings);
    component.$onInit();
    expect(component.shouldShowLoader).toEqual(true);
  });

  it('should hide loader on request complete', () => {
    const bindings = mockFetchBindings('success');
    const component = compile(bindings);
    component.$onInit();
    expect(component.shouldShowLoader).toEqual(false);
  });

  it('should show content on request success', () => {
    const bindings = mockFetchBindings('success');
    const component = compile(bindings);
    component.$onInit();
    expect(component.shouldShowContent).toEqual(true);
  });

  it('should show alert error message on request error', () => {
    const bindings = mockFetchBindings('error');
    const component = compile(bindings);
    component.$onInit();
    expect(component.alert.theme).toEqual('error');
    expect(component.alert.message).toEqual('Failed on processing request. Please, try again.');
    expect(typeof component.alert.retryAction).toEqual('function');
  });

  it('should show custom alert error message on request error', () => {
    const customErrorMessage = 'Custom error message';
    const bindings = mockFetchBindings('error');
    bindings.alertErrorMessage = customErrorMessage;
    const component = compile(bindings);
    component.$onInit();
    expect(component.alert.message).toEqual(customErrorMessage);
  });

  it('should clear alert on fetch data', () => {
    const bindings = mockFetchBindings('success');
    const component = compile(bindings);
    component.alert = {some: 'alert'};
    component.$onInit();
    expect(component.alert).toEqual(null);
  });

  it('should transclude some content', () => {
    const element = compileElement('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
