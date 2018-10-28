import { PromiseMock } from '@mocks/promise';

describe('Digestion Service', () => {
  let service, timeout;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject($injector => {
      timeout = $injector.get('$timeout');
      service = $injector.get('digestionService');
    });
  });

  it('should call given action', () => {
    const action = jest.fn(() => new PromiseMock());
    service.request(action);
    expect(action).toHaveBeenCalled();
  });

  it('should call given success callback', () => {
    const responseMock = {some: 'reponse'};
    const action = jest.fn(() => new PromiseMock('success', responseMock));
    const success = jest.fn();
    service.request(action, {success});
    timeout.flush();
    expect(success).toHaveBeenCalledWith(responseMock);
  });

  it('should call given error callback', () => {
    const errorMock = {some: 'error'};
    const action = jest.fn(() => new PromiseMock('error', errorMock));
    const err = jest.fn();
    service.request(action, {error: err});
    timeout.flush();
    expect(err).toHaveBeenCalledWith(errorMock);
  });
});
