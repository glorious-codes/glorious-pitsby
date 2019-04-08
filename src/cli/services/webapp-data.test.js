const path = require('path');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

describe('Webapp Data Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
  });

  it('should be able to save an object passed as data', () => {
    const filename = 'projects.json';
    const data = [{engine: 'vue'}, {engine: 'angular'}];
    const onSuccess = jest.fn();
    webappDataService.save(filename, data, onSuccess);
    expect(fileService.write.mock.calls[0][0]).toEqual(
      path.join(__dirname, `../../webapp/data/${filename}`)
    );
    expect(fileService.write.mock.calls[0][1]).toEqual(JSON.stringify(data));
    expect(fileService.write.mock.calls[0][2]).toEqual(onSuccess);
  });

  it('should be able to save a string passed as data', () => {
    const filename = 'metrics-ids.js';
    const data = 'module.exports = {some: "id"}';
    webappDataService.save(filename, data, jest.fn());
    expect(fileService.write.mock.calls[0][0]).toEqual(
      path.join(__dirname, `../../webapp/data/${filename}`)
    );
    expect(fileService.write.mock.calls[0][1]).toEqual(data);
  });
});
