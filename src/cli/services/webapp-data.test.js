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
    webappDataService.save('projects', data);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, `../../webapp/data/${filename}.json`),
      JSON.stringify(data)
    );
  });
});
