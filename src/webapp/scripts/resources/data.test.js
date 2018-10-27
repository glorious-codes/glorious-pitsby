import dateService from '@scripts/services/date';
import baseResource from './base';
import dataResource from './data';
import { PromiseMock } from '@mocks/promise';

describe('Data Resource', () => {
  const responseMock = [{some: 'response'}];

  beforeEach(() => {
    dateService.getNow = jest.fn(() => new Date(2018, 9, 21));
    baseResource.get = jest.fn(() => new PromiseMock('success', {
      data: responseMock
    }));
  });

  it('should be able to get data', () => {
    const uri = '/components';
    dataResource.get(uri);
    expect(baseResource.get.mock.calls[0][0]).toEqual('/data/components.json');
  });

  it('should always pass a timestamp query param on get data', () => {
    const uri = '/components';
    dataResource.get(uri);
    expect(baseResource.get).toHaveBeenCalledWith('/data/components.json', {t: 1540090800000});
  });

  it('should be able to pass custom query params on get data', () => {
    const uri = '/components';
    const query = {custom: 'param'};
    dataResource.get(uri, query);
    expect(baseResource.get).toHaveBeenCalledWith('/data/components.json', {
      t: 1540090800000,
      custom: 'param'
    });
  });

  it('should respond with data attribute found in response', () => {
    const reponse = dataResource.get('/components');
    expect(reponse).toEqual(responseMock);
  });
});
