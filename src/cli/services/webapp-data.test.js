const path = require('path');
const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const { fileService } = require('./file');
const configService = require('./config');
const processService = require('./process');
const webappDataService = require('./webapp-data');

describe('Webapp Data Service', () => {
  beforeEach(() => {
    configService.get = jest.fn(() => buildPitsbyConfigMock())
    fileService.write = jest.fn();
    processService.getCwd = jest.fn(() => '/client')
  });

  it('should be able to save an object passed as data', () => {
    const filename = 'projects.json';
    const data = [{engine: 'vue'}, {engine: 'angular'}];
    const onSuccess = jest.fn();
    const onError = jest.fn();
    webappDataService.save(filename, data, onSuccess, onError);
    expect(fileService.write).toHaveBeenCalledWith(
      `/client/docs/data/${filename}`,
      JSON.stringify(data),
      onSuccess,
      onError
    );
  });

  it('should be able to save a string passed as data', () => {
    const filename = 'metrics-ids.js';
    const data = 'module.exports = {some: "id"}';
    const onSuccess = jest.fn();
    const onError = jest.fn();
    webappDataService.save(filename, data, onSuccess, onError);
    expect(fileService.write).toHaveBeenCalledWith(
      `/client/docs/data/${filename}`,
      data,
      onSuccess,
      onError
    );
  });
});
