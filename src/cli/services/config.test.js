const { fileService } = require('./file');
const configService = require('./config');

describe('Config Service', () => {
  function buildConfigFile(){
    return {
      projects: [ { engine: 'vue', collectDocsFrom: './src/vue' } ],
      styles: [ './dist/ca-components.css' ],
      scripts: [ './dist/ca-components-vue.js' ],
      other: [ './dist/assets/images/' ]
    };
  }

  function mockConfigFile(configFile, fileType){
    fileService.readJSONSync = jest.fn(param => {
      if(param == '/client/pitsby.json' && fileType == 'json')
        return configFile;
    });
    fileService.require = jest.fn(param => {
      if(param == '/client/pitsby.js' && fileType == 'js')
        return configFile;
    });
  }

  it('should get javascript config file', () => {
    const configFileMock = {some: 'js-config'};
    mockConfigFile(configFileMock, 'js');
    const configFile = configService.get('/client');
    expect(configFile).toEqual(configFileMock);
  });

  it('should get json config file if no javascript config file has been found', () => {
    const configFileMock = buildConfigFile();
    mockConfigFile(configFileMock, 'json');
    const configFile = configService.get('/client');
    expect(fileService.readJSONSync).toHaveBeenCalledWith('/client/pitsby.json');
    expect(configFile).toEqual(configFileMock);
  });

  it('should normalize config attributes when angular config is outside projects', () => {
    const configFileMock = buildConfigFile();
    configFileMock.collectFrom = './src/angular';
    configFileMock.moduleName = 'my-components';
    mockConfigFile(configFileMock, 'js');
    expect(configService.get('/client').projects).toEqual([
      { engine: 'vue', collectDocsFrom: './src/vue' },
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should create projects attribute when config has no projects attribute', () => {
    const configFileMock = buildConfigFile();
    delete configFileMock.projects;
    configFileMock.collectFrom = './src/angular';
    configFileMock.moduleName = 'my-components';
    mockConfigFile(configFileMock, 'js');
    expect(configService.get('/client').projects).toEqual([
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should normalize project engine case', () => {
    mockConfigFile({projects: [{ engine: 'Vue', collectDocsFrom: './src/vue' }]}, 'js');
    expect(configService.get('/client').projects).toEqual([
      { engine: 'vue', collectDocsFrom: './src/vue' }
    ]);
  });

  it('should not normalize anything if config has no projects at all', () => {
    const configMock = {scripts: ['./dist/components.js']};
    mockConfigFile(configMock, 'js');
    expect(configService.get('/client')).toEqual(configMock);
  });
});
