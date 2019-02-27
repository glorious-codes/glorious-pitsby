const path = require('path');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

describe('Webapp Data Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
  });

  it('should save data', () => {
    const filename = 'projects';
    const data = [{engine: 'vue'}, {engine: 'angular'}];
    const onSuccess = jest.fn();
    webappDataService.save('projects', data, onSuccess);
    expect(fileService.write.mock.calls[0][0]).toEqual(
      path.join(__dirname, `../../webapp/data/${filename}.json`)
    );
    expect(fileService.write.mock.calls[0][1]).toEqual(JSON.stringify(data));
    expect(fileService.write.mock.calls[0][2]).toEqual(onSuccess);
  });
});
