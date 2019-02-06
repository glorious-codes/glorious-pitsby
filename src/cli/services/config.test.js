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

  function mockConfigFile(configFile){
    fileService.readJSONSync = jest.fn(() => configFile);
  }

  it('should get config file passing client directory', () => {
    const configFileMock = buildConfigFile();
    mockConfigFile(configFileMock);
    const configFile = configService.get('/client');
    expect(fileService.readJSONSync).toHaveBeenCalledWith('/client/pitsby.json');
    expect(configFile).toEqual(configFileMock);
  });

  it('should normalize config attributes when angular config is outside projects', () => {
    const configFileMock = buildConfigFile();
    configFileMock.collectFrom = './src/angular';
    configFileMock.moduleName = 'my-components';
    mockConfigFile(configFileMock);
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
    mockConfigFile(configFileMock);
    expect(configService.get('/client').projects).toEqual([
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should normalize project engine case', () => {
    mockConfigFile({projects: [{ engine: 'Vue', collectDocsFrom: './src/vue' }]});
    expect(configService.get('/client').projects).toEqual([
      { engine: 'vue', collectDocsFrom: './src/vue' }
    ]);
  });

  it('should not normalize anything if config has no projects at all', () => {
    const configMock = {scripts: ['./dist/components.js']};
    mockConfigFile(configMock);
    expect(configService.get('/client')).toEqual(configMock);
  });
});
