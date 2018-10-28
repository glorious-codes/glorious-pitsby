import { DigestionServiceMock } from '@mocks/digestion-service';

describe('Requester', () => {
  let compile, compileElement, digestionService;

  function stubDigestionServiceRequest(reponseType, reponse){
    digestionService = new DigestionServiceMock(reponseType, reponse);
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      const $rootScope = $injector.get('$rootScope');
      const $compile = $injector.get('$compile');
      const $componentController = $injector.get('$componentController');
      digestionService = $injector.get('digestionService');
      compile = bindings => {
        return $componentController('pRequester', {
          digestionService
        }, bindings);
      };
      compileElement = (content = '') => {
        const scope = $rootScope.$new(true);
        const template = `<p-requester>${content}</p-requester>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
      stubDigestionServiceRequest();
    });
  });

  it('should show content if no fetch has been passed', () => {
    const component = compile();
    component.$onInit();
    expect(component.shouldShowContent).toEqual(true);
  });

  it('should optionally hide content on request', () => {
    const component = compile({
      fetch: jest.fn(),
      shouldHideContentOnRequest: true
    });
    component.$onInit();
    expect(component.shouldShowContent).toEqual(false);
  });

  it('should optionally hide content on request error', () => {
    const component = compile({
      fetch: jest.fn(),
      shouldHideContentOnRequest: true
    });
    component.$onInit();
    expect(component.shouldShowContent).toEqual(false);
  });

  it('should fetch data on initialize if fetch action has been passed', () => {
    const fetch = jest.fn();
    const component = compile({fetch});
    component.$onInit();
    expect(digestionService.request.mock.calls[0][0]).toEqual(fetch);
  });

  it('should call fetch success action on fetch data success', () => {
    const response = {some: 'response'};
    stubDigestionServiceRequest('success', response);
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const component = compile({fetch, fetchSuccess});
    component.$onInit();
    expect(fetchSuccess).toHaveBeenCalledWith(response);
  });

  it('should show loader on request', () => {
    const fetch = jest.fn();
    const component = compile({fetch});
    component.$onInit();
    expect(component.shouldShowLoader).toEqual(true);
  });

  it('should hide loader on request complete', () => {
    stubDigestionServiceRequest('success');
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const component = compile({fetch, fetchSuccess});
    component.$onInit();
    expect(component.shouldShowLoader).toEqual(false);
  });

  it('should show content on request success', () => {
    stubDigestionServiceRequest('success');
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const component = compile({fetch, fetchSuccess});
    component.$onInit();
    expect(component.shouldShowContent).toEqual(true);
  });

  it('should show alert error message on request error', () => {
    stubDigestionServiceRequest('error');
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const component = compile({fetch, fetchSuccess});
    component.$onInit();
    expect(component.alert.theme).toEqual('danger');
    expect(component.alert.message).toEqual('Failed to process request. Please, try again.');
    expect(typeof component.alert.retryAction).toEqual('function');
  });

  it('should show custom alert error message on request error', () => {
    stubDigestionServiceRequest('error');
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const alertErrorMessage = 'Custom error message';
    const component = compile({fetch, fetchSuccess, alertErrorMessage});
    component.$onInit();
    expect(component.alert.message).toEqual(alertErrorMessage);
  });

  it('should clear alert on fetch data', () => {
    stubDigestionServiceRequest();
    const fetch = jest.fn();
    const fetchSuccess = jest.fn();
    const component = compile({fetch, fetchSuccess});
    component.alert = {some: 'alert'};
    component.$onInit();
    expect(component.alert).toEqual(null);
  });

  it('should transclude some content', () => {
    const element = compileElement('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
